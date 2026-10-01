const express = require("express");
const {
  createOrder,
  getOrder,
  getAllOrders,
  cancelOrder,
  adminGetAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Customer order routes
router.post("/create", protect, createOrder);
router.get("/allOrders", protect, getAllOrders);
router.get("/:orderId", protect, getOrder);
router.put("/cancel/:orderId", protect, cancelOrder);

// Admin order management routes
router.get("/admin/all", protect, adminOnly, adminGetAllOrders);
router.put("/admin/status/:orderId", protect, adminOnly, updateOrderStatus);

module.exports = router;

