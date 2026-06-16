import { Router } from "express";
import { getReviews, getReviewById, createReview, updateReview, deleteReview } from "../controllers/reviewController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
