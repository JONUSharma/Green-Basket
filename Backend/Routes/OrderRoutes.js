const express = require("express");
const { createOrder, cancelOrder, updateOrderStatus, fetchSingleOrder, getAllOrders } = require("../Controller/OrderController.js");
const { protect } = require("../middleware/authmiddleware.js"); // 

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getAllOrders);
router.put("/cancel/:id", protect, cancelOrder);
router.put("/update-status/:id", protect, updateOrderStatus);
router.get("/:id", protect, fetchSingleOrder);

module.exports = router;
