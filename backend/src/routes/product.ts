import express from "express";
import * as ProductController from "../controllers/product";

const router = express.Router();

router.get("/", ProductController.getProducts);

router.post("/", ProductController.createProduct);

router.patch('/:productId', ProductController.UpdateProduct);

router.delete('/:productId', ProductController.DeleteProduct);

//this api is to insert multiple product at once
router.post("/multipleProduct/", ProductController.CreateMultipleProduct);

export default router;