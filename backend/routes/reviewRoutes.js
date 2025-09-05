import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, userOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST new review (user only)
router.post("/", protect, userOnly, addReview);

// PUT update review (user only, only their own review)
router.put("/:id", protect, userOnly, updateReview);

// DELETE review (user only, only their own review)
router.delete("/:id", protect, userOnly, deleteReview);

export default router;
