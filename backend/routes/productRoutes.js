import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { getProductWithReviews } from "../controllers/reviewController.js";

const router = express.Router();

// Admin product management
router.post("/", protect, adminOnly, upload.single("image"), addProduct);
router.get("/", protect, getProducts);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// ✅ Public product detail (with reviews)
router.get("/:id", getProductWithReviews);

export default router;
