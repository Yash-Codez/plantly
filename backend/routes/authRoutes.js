import express from "express";
import { signup, login, logout,forgotPassword,resetPassword } from "../controllers/authController.js";
import { protect, adminOnly,userOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

// Public
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected
router.post("/logout", protect, logout);

// Admin-only test route
router.get("/admin-dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

router.get("/user-dashboard", protect, userOnly, (req, res) => {
  res.json({ message: "Welcome User!" });
});

// Update profile (with optional image upload)
router.put(
  "/profile",
  protect,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (user) {
        user.username = req.body.username || user.username;
        user.contact = req.body.contact || user.contact;
        user.address = req.body.address || user.address;

        if (req.file) {
          user.profilePhoto = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();
        res.json({
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          contact: updatedUser.contact,
          address: updatedUser.address,
          profilePhoto: updatedUser.profilePhoto,
          role: updatedUser.role,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// Get profile (Protected)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
        address: user.address,
        profilePhoto: user.profilePhoto,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Get all addresses
router.get("/addresses", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses);
});

// ✅ Add address
router.post("/addresses", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.json(user.addresses);
});

// ✅ Delete address
router.delete("/addresses/:id", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
  await user.save();
  res.json(user.addresses);
});

// ✅ Get payment methods
router.get("/payment-methods", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.paymentMethods);
});

// ✅ Add payment method
router.post("/payment-methods", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.paymentMethods.push(req.body);
  await user.save();
  res.json(user.paymentMethods);
});

// ✅ Delete payment method
router.delete("/payment-methods/:id", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.paymentMethods = user.paymentMethods.filter(pm => pm._id.toString() !== req.params.id);
  await user.save();
  res.json(user.paymentMethods);
});

// ✅ Get all delivery boys
router.get("/delivery-boys", protect, adminOnly, async (req, res) => {
  const deliveryBoys = await User.find({ role: "delivery" }).select("-password -securityAnswer");
  res.json(deliveryBoys);
});

// ✅ Create delivery boy
router.post("/delivery-boys", protect, adminOnly, async (req, res) => {
  try {
    const { username, email, password, contact } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const deliveryBoy = new User({
      username,
      email,
      password,
      contact,
      role: "delivery",
      securityQuestion: "Default Question",
      securityAnswer: "default", // hashed automatically
    });

    await deliveryBoy.save();
    res.status(201).json(deliveryBoy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete delivery boy
router.delete("/delivery-boys/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Delivery boy removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
