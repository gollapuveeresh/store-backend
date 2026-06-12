const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders — Customer: place order
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in order" });
    if (!shippingAddress)
      return res.status(400).json({ message: "Shipping address is required" });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const user = await User.findById(req.user._id);
    const discountPercent = user.discount || 0;
    const discountAmount = +(subtotal * (discountPercent / 100)).toFixed(2);
    const totalAmount = +(subtotal - discountAmount).toFixed(2);

    const order = await Order.create({
      customer: req.user._id,
      items,
      subtotal,
      discountPercent,
      discountAmount,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Order creation error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/mine — Customer: own orders
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders — Admin: all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status — Admin: update order status
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("customer", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/stats — Admin: dashboard stats
router.get("/stats/summary", protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const recentOrders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      totalOrders,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
