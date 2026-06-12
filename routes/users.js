const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/users — Admin: list all customers
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile/me — Customer: update own profile
// ⚠️ Must be BEFORE /:id to prevent Express from matching "profile" as an :id
router.put("/profile/me", protect, async (req, res) => {
  try {
    const { name, phone, address, profilePic } = req.body;
    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (address) update.address = address;
    if (profilePic) update.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/stats/admin — Admin dashboard overview stats
// ⚠️ Must be BEFORE /:id to prevent Express from matching "stats" as an :id
router.get("/stats/admin", protect, adminOnly, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();
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
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id — Admin: get single user
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id/discount — Admin: give discount to a customer
router.put("/:id/discount", protect, adminOnly, async (req, res) => {
  try {
    const { discount, tier } = req.body;
    const update = {};
    if (discount !== undefined) update.discount = discount;
    if (tier) update.tier = tier;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Customer updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id — Admin: remove customer
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Customer removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
