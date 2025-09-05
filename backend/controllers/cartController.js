import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cartItem = await Cart.findOne({ user: req.user._id, product: productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ user: req.user._id, product: productId, quantity });
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate("product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
