import express from "express";
import * as ReviewController from "../controllers/reviews";

const router = express.Router();

router.get("/", ReviewController.getReviews);

router.get("/:productId", ReviewController.getReviewsByProduct);

router.post("/", ReviewController.createReview);

router.delete("/:reviewId", ReviewController.deleteReview);

export default router;