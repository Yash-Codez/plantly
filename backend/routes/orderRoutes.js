import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly, deliveryOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin fetch all orders
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email contact")
      .populate("cartItems.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all orders" });
  }
});

// ✅ Create new order with OTP
router.post("/", protect, async (req, res) => {
  try {
    const { cart, totalAmount, address, paymentId, orderId } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate 6-digit OTP

    const order = new Order({
      user: req.user._id,
      cartItems: cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      address,
      paymentId,
      razorpayOrderId: orderId,
      status: "Confirmed",
      deliveryStatus: "Unassigned",
      otp,
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Error saving order" });
  }
});

// ✅ Get user orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("cartItems.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders" });
  }
});

// ✅ Admin assigns delivery boy
router.post("/assign", protect, adminOnly, async (req, res) => {
  const { orderId, deliveryBoyId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.assignedTo = deliveryBoyId;
    order.deliveryStatus = "Assigned";
    await order.save();

    res.json({ message: "Delivery boy assigned", order });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get single order by ID (for user tracking)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id, // ensure user can only see their own order
    })
      .populate("cartItems.product", "name price")
      .populate("assignedTo", "username contact");

    if (!order) return res.status(404).json({ msg: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching order" });
  }
});


// ✅ Delivery boy fetch assigned orders
router.get("/delivery/assigned", protect, deliveryOnly, async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id })
      .populate("user", "username contact addresses")
      .populate("cartItems.product", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Delivery boy update status (with OTP verification)
router.put("/:id/delivery-status", protect, deliveryOnly, async (req, res) => {
  try {
    const { deliveryStatus, deliveryNotes, otp } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      assignedTo: req.user._id,
    });
    if (!order) return res.status(404).json({ msg: "Order not found or not assigned to you" });

    if (deliveryStatus === "Delivered") {
      if (!otp) return res.status(400).json({ msg: "OTP required to mark as delivered" });
      if (order.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });

      order.otpVerified = true;
      order.status = "Delivered";
    }

    order.deliveryStatus = deliveryStatus || order.deliveryStatus;
    order.deliveryNotes = deliveryNotes ?? order.deliveryNotes;

    await order.save();

    const populated = await Order.findById(order._id)
      .populate("user", "username email contact")
      .populate("cartItems.product", "name price");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating delivery status" });
  }
});

// ✅ User requests return
router.put("/:id/return", protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.status !== "Delivered") {
      return res.status(400).json({ msg: "Return allowed only after delivery" });
    }

    order.returnRequested = true;
    order.returnReason = reason || "No reason provided";
    order.returnStatus = "Pending";

    await order.save();
    res.json({ msg: "Return requested successfully", order });
  } catch (err) {
    res.status(500).json({ msg: "Error requesting return" });
  }
});

// ✅ Admin updates return status
router.put("/:id/return-status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // "Approved" or "Rejected"
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (!order.returnRequested) {
      return res.status(400).json({ msg: "No return request for this order" });
    }

    order.returnStatus = status;
    if (status === "Approved") {
      order.deliveryStatus = "Return Pickup Pending";
    }

    await order.save();
    res.json({ msg: "Return status updated", order });
  } catch (err) {
    res.status(500).json({ msg: "Error updating return status" });
  }
});


export default router;
