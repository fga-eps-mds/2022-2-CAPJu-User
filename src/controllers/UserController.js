import User from "../schemas/User.js";
import { UserValidator, UserEditRoleValidator } from "../validators/User.js";
import { unityAdmin, removeAdmin } from "../validators/Unity.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sha256 } from "js-sha256";
import Unity from "../schemas/Unity.js";
import ValidateCPF from "../validators/ValidateCPF.js"

class UserController {
  async createUser(req, res) {
    try {
      //cria nome
      const { name, email, password, role, unity, cpf } =
        await UserValidator.validateAsync(req.body);
      //ve se o email existe
      const EmailAlreadyExist = await User.findOne({
        email,
      });
      const CPFAlreadyExist = await User.findOne({
        cpf,
      })
      if (EmailAlreadyExist) {
        return res.status(400).json({ message: "Email ja existe!" });
      }

      if (CPFAlreadyExist) {
        return res.status(400).json({ message: "CPF ja existe!" });
      }

      if(!ValidateCPF(cpf)){
        return res.status(400).json({ message: "CPF inválido!" });
      }

      const existingUnity = await Unity.findOne({
        _id: unity,
      });
      if (!existingUnity) {
        return res.status(404).json({ message: "Unidade não encontrada" });
      }
      
      const fullName =
        /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;
      
      if (!fullName.test(name)) {
        return res.status(400).json({ message: "O nome precisa conter um sobrenome"});
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //cria novo array de user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        unity,
        cpf,
      });
      if (user) {
        return res.status(200).json({
          _id: user.id,
          name: user.name,
          role: user.role,
          unity: user.unity,
          email: user.email,
          cpf: user.cpf,
          token: generateToken(user._id),
        });
      } else {
        return res.status(400);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async searchUsers(req, res) {
    try {
      let search = req.params.name;

      const query = { $text: { $search: "/" + search + "/" } };

      console.log(search, query);

      const user = await User.find(query).limit(10);
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async allUser(req, res) {
    try {
      let accepted, user;
      if (req.query.accepted) {
        accepted = req.query.accepted === "true";
        user = await User.find({ accepted: accepted });
      } else user = await User.find();
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  // Endpoint de editar role de um usuário
  async editRoleUser(req, res) {
    try {
      const body = await UserEditRoleValidator.validateAsync(req.body);
      const result = await User.updateOne({ _id: body._id }, body);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  //----------------------------------------------
  async user(req, res) {
    try {
      const user = await User.findOne({ name: req.body.name });
      if (!user) {
        return res.status(404).json({ message: "o usuário não existe" });
      }
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      // Check for user email
      const user = await User.findOne({ email: email.toString() });
      if (!user)
        return res.status(401).json({ message: "o usuário não existe" });
      if (!user.accepted) {
        return res
          .status(401)
          .json({ message: "solicitação de cadastro pendente" });
      }

      if (user && (await bcrypt.compare(password.toString(), user.password))) {
        let expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + 3);
        return res.status(200).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
          expiresIn,
        });
      } else {
        return res.status(400).json({ message: "senha inválida" });
      }
    } catch (error) {
      return res.status(500).json({ message: "erro inesperado" });
    }
  }

  async requestRecoveryMail(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toString() });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Nenhum usuário com este e-mail foi encontrado" });
      }

      const transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
        port: 465,
        host: "smtp.gmail.com",
      });

      let date = new Date();
      date.setDate(date.getDate() + 1);

      const hash = sha256(process.env.JWT_SECRET + email + date.getDate());

      let link = "https://capju.vercel.app/recovery/" + hash;

      await User.updateOne(
        { _id: user._id },
        { recoveryHash: hash, recoveryDate: date },
        { upsert: true }
      );

      const mailSent = await transporter.sendMail({
        text:
          "Recuperação de senha \n\n Abra o link abaixo para redefinir a sua senha \n\n " +
          link,
        subject: "Capju Login",
        from: process.env.EMAIL_ADDRESS,
        to: email,
      });

      res.status(200).send({ mailSent });

      // Check for user email
    } catch (error) {
      console.log("error", error);
      return res.status(500);
    }
  }
  async editPassword(req, res) {
    try {
      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Nenhum usuário foi encontrado" });
      }

      if (await bcrypt.compare(oldPassword, user.password)) {
        await User.updateOne(
          { _id: req.params.id },
          { password: hashedPassword },
          { upsert: true }
        );
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso!" });
      }
      return res.status(400).json({ message: "Senha inválida! " });
    } catch (error) {
      return res.status(500).json({ message: "Erro a atualizar usuário " });
    }
  }

  async updateUser(req, res) {
    try {
      const editEmail = await User.updateOne({ _id: req.params.id }, req.body);
      return res.status(200).json(editEmail);
    } catch (error) {
      return res.status(500).json({ message: "Usuário não atualizado!" });
    }
  }

  async updatePassword(req, res) {
    try {
      const { hash, newPassword } = req.body;

      const user = await User.findOne({ recoveryHash: hash.toString() });

      if (!user) {
        return res.status(404).json({
          message: "Nenhuma recuperação com esta chave foi encontrada",
        });
      }

      if (user.recoveryDate?.getTime() < new Date().getTime()) {
        return res.status(400).json({
          message: "Link de recuperação expirou",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword.toString(), salt);

      await User.updateOne(
        { _id: user._id },
        { password: hashedPassword },
        { upsert: true }
      );

      res.status(200).send();

      // Check for user email
    } catch (error) {
      console.log("error", error);
      return res.status(500);
    }
  }

  async setUnityAdmin(req, res) {
    try {
      const { unityId, userId } = await unityAdmin.validateAsync(req.body);

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
        });
      }

      const unity = await Unity.findOne({ _id: unityId });
      if (!unity) {
        return res.status(404).json({
          message: "Unidade não encontrado",
        });
      }

      const result = await User.updateOne(
        { _id: user._id },
        { unityAdmin: unity._id },
        { upsert: true }
      );

      return res.status(200).send(result);
    } catch (error) {
      console.log("error", error);
      return res.status(500);
    }
  }

  async removeUnityAdmin(req, res) {
    try {
      const { unityId, adminId } = await removeAdmin.validateAsync(req.body);

      const user = await User.findOne({ _id: adminId });
      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
        });
      }

      const unity = await Unity.findOne({ _id: unityId });
      if (!unity) {
        return res.status(404).json({
          message: "Unidade não encontrado",
        });
      }

      const result = await User.updateOne(
        { _id: user._id },
        { unityAdmin: null },
        { upsert: true }
      );

      return res.status(200).send(result);
    } catch (error) {
      console.log("error", error);
      return res.status(500);
    }
  }

  async acceptRequest(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.updateOne({ _id: userId }, { accepted: true });

      return res.status(200).send(user);
    } catch (error) {
      console.log("error", error);
      return res.status(500);
    }
  }

  async deleteRequest(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.deleteOne({ _id: userId });

      if (user.deletedCount === 0) {
        return res.status(400).send({ message: "Usuário já deletado" });
      }

      return res.status(200).send(user);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json(error);
    }
  }
}
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
export default new UserController();
