import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

router.post("/authentication", UserController.getAuthenticatedUser);

router.get("/:userId", UserController.getUser);

router.post("/", UserController.createUser);

router.patch("/updateUser", UserController.updateUser);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/resetPasswordToken", UserController.getResetPasswordToken);

router.post("/resetPassword", UserController.resetPassword);

export default router;
