import express from "express";
import * as CartController from "../controllers/cart";

const router = express.Router();

router.get("/:userId", CartController.getCartContent);
router.post("/", CartController.createCart);
router.patch("/:cartId", CartController.updateCart);

export default router;
