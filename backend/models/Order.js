import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // delivery boy
    deliveryStatus: {
      type: String,
      enum: ["Unassigned", "Assigned", "Out for Delivery", "Delivered", "Failed"],
      default: "Unassigned",
    },
    deliveryNotes: { type: String, default: "" },

    // 🔹 OTP for secure delivery
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },
    cancelReason: { type: String, default: "" },
    isCancelled: { type: Boolean, default: false },

    returnRequested: { type: Boolean, default: false },
    returnReason: { type: String, default: "" },
    returnStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
