import express from "express";
import * as ProductController from "../controllers/product";

const router = express.Router();

router.get("/", ProductController.getProducts);

router.post("/", ProductController.createProduct);

export default router;