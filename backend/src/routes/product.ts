import express from "express";
import * as ProductController from "../controllers/product";

const router = express.Router();

router.get("/", ProductController.getProducts);

router.post("/", ProductController.createProduct);

router.patch('/:productId', ProductController.updateProduct);

router.delete('/:productId', ProductController.deleteProduct);

//this api is to insert multiple product at once
router.post("/multipleProduct/", ProductController.createMultipleProduct);

//to get unique product categories
router.get("/productCategories/", ProductController.getProductCategories);

export default router;