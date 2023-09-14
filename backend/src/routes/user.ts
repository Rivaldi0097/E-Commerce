import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

router.get("/", UserController.getAuthenticatedUser);

router.get("/:username", UserController.getUser);

router.post("/", UserController.createUser);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;
