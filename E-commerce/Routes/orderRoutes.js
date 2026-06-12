const express = require("express");
const router = express.Router();
const { createOrder, getOrdersByUser, updateOrderStatus } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/user/:userId", getOrdersByUser);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;