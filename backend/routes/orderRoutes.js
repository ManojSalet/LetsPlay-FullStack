const express = require("express");
const {
  createOrder,
  getOrder,
  getAllOrders,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/allOrders", protect, getAllOrders);
router.get("/:orderId", protect, getOrder);

module.exports = router;
