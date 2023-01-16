import { Router } from "express";
import UserController from "./controllers/UserController.js";
import { protect, authRole } from "./middleware/authMiddleware.js";
import { ROLE } from "./schemas/role.js";

const routes = Router();

routes.get("/user", UserController.user);
routes.get("/searchUsers/:name", protect, UserController.searchUsers);
routes.get("/searchUsers", protect, UserController.allUser);
routes.post("/newUser", UserController.createUser);
routes.get(
  "/allUser",
  protect,
  authRole([ROLE.DIRETOR, ROLE.JUIZ]),
  UserController.allUser
);
routes.post("/login", UserController.login);
routes.post("/requestRecovery", UserController.requestRecoveryMail);
routes.post("/updatePassword", UserController.updatePassword);
routes.put("/updateUser/:id", UserController.updateUser);
routes.post("/updateUserPassword/:id", UserController.editPassword);
routes.post("/acceptRequest/:userId", protect, UserController.acceptRequest);
routes.delete("/deleteRequest/:userId", protect, UserController.deleteRequest);
routes.put(
  "/updateRole",
  protect,
  authRole([ROLE.DIRETOR]),
  UserController.editRoleUser
);
routes.post(
  "/acceptRequest/:userId",
  protect,
  authRole([ROLE.DIRETOR]),
  UserController.acceptRequest
);
routes.delete(
  "/deleteRequest/:userId",
  protect,
  authRole([ROLE.DIRETOR]),
  UserController.deleteRequest
);
routes.post(
  "/setUnityAdmin",
  protect,
  authRole([ROLE.DIRETOR]),
  UserController.setUnityAdmin
);
routes.post(
  "/removeUnityAdmin",
  protect,
  authRole([ROLE.DIRETOR]),
  UserController.removeUnityAdmin
);

export default routes;
