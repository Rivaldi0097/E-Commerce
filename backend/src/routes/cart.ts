import express from "express";
import * as CartController from "../controllers/cart";

const router = express.Router();

router.get("/:userId", CartController.getCartContent);
router.post("/", CartController.createCart);
router.patch("/:cartId", CartController.updateCart);
router.delete("/:cartId", CartController.removeProductInCart);
router.delete(
  "/removeAllProduct/:userId",
  CartController.removeAllProductsInCart
);
router.delete("/removeCart/:userId", CartController.removeCart);

export default router;
