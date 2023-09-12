import express from "express";
import * as CartController from "../controllers/cart";

const router = express.Router();

router.post("/", CartController.createCart);
router.patch("/:cartId", CartController.updateCart);

export default router;
