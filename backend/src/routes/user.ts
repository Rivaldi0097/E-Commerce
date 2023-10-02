import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();
var cors = require("cors");

router.get("/", UserController.getAuthenticatedUser);

router.get("/:username", UserController.getUser);

router.post("/", UserController.createUser);

router.post("/login",cors(), UserController.login);

router.post("/logout", UserController.logout);

router.post("/resetPasswordToken", UserController.getResetPasswordToken);

router.post("/resetPassword", UserController.resetPassword);

export default router;
