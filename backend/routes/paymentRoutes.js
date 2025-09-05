import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Create Razorpay order
router.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount, // in paise
      currency: req.body.currency,
      receipt: req.body.receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Some error occurred");
    }
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Validate Razorpay signature
router.post("/order/validate", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction not valid" });
    }

    res.json({
      msg: "Transaction successful",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error("Error validating Razorpay payment:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default router;
