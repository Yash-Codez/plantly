import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/productModel.js";

const router = express.Router();

// @desc Get admin analytics
// @route GET /api/admin/analytics
// @access Private/Admin
router.get("/analytics", protect, adminOnly, async (req, res) => {
  try {
    // ✅ Get all orders
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    // ✅ Monthly sales (group by createdAt)
    const monthlySales = {};
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
      monthlySales[month] = (monthlySales[month] || 0) + (order.totalAmount || 0);
    });

    const monthlySalesArray = Object.keys(monthlySales).map((month) => ({
      month,
      sales: monthlySales[month],
    }));

    // ✅ Top products (based on cartItems)
    const productSales = {};
    orders.forEach((order) => {
      order.cartItems.forEach((item) => {
        const productId = item.product?.toString();
        if (productId) {
          productSales[productId] = (productSales[productId] || 0) + (item.quantity || 0);
        }
      });
    });

    // Fetch product names
    const productIds = Object.keys(productSales);
    const products = await Product.find({ _id: { $in: productIds } });

    const topProducts = products.map((p) => ({
      name: p.name,
      sales: productSales[p._id.toString()] || 0,
    }));

    res.json({
      totalOrders,
      totalRevenue,
      monthlySales: monthlySalesArray,
      topProducts,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
