import Wishlist from "../models/wishlistModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const exists = await Wishlist.findOne({ user: req.user._id, product: productId });

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = new Wishlist({ user: req.user._id, product: productId });
    await wishlistItem.save();
    res.json(wishlistItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id }).populate("product");
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
