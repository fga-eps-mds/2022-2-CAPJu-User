import Joi from "joi";
import { ROLE } from "../schemas/role.js";

export const UserValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.number().required().valid(...Object.values(ROLE)),
  unity: Joi.string().required(),
  cpf: Joi.string().required(),
});

export const UserEditRoleValidator = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow(null, ""),
  email: Joi.string().allow(null, ""),
  role: Joi.number().required().valid(...Object.values(ROLE)),
  deleted: Joi.bool().allow(null),
  updatedAt: Joi.string().allow(null, ""),
  unity: Joi.string().allow(null, ""),
});
