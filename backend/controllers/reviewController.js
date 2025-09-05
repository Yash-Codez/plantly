import Review from "../models/Review.js";
import Product from "../models/productModel.js";

// Add review
// Add review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();
    const populatedReview = await review.populate("user", "_id username");
    res.json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();
    const populatedReview = await review.populate("user", "_id username");

    res.json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get product with reviews
export const getProductWithReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const reviews = await Review.find({ product: req.params.id })
      .populate("user", "_id username");
    res.json({ product, reviews });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
