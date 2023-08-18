import express from "express";
import * as OrderController from "../controllers/order";

const router = express.Router();

router.get("/", OrderController.getOrders);

router.post("/", OrderController.createOrder);

export default router;