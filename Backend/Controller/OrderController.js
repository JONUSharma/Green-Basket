const Order = require("../Model/OrderModel.js");
const Product = require("../Model/ProductModel.js");

const createOrder = async (req, res) => {
  try {
    const { productId, quantity, address } = req.body;

    const product = await Product.findById(productId).populate("farmer");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!product.isApproved) {
      return res.status(400).json({ success: false, message: "Product not approved for sale" });
    }

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      product: productId,
      quantity,
      totalPrice,
      buyer: req.user.id,   // from auth middleware
      farmer: product.farmer._id,
      name: product.name,
      address
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// get single order
const fetchSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product", "name image price")
      .populate("buyer", "name email phone")
      .populate("farmer", "name email phone");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.farmer._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }


    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
// get all orders
const getAllOrders = async (req, res) => {
  try {
    // Safety check: make sure req.user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in request.",
      });
    }

    // Fetch orders for the logged-in user
    const orders = await Order.find({ buyer: req.user._id })
      .populate("product", "name image price")   // Product info
      .populate("farmer", "name email phone")   // Farmer info
      .sort({ createdAt: -1 })                  // Latest orders first
      .lean();                                  // Return plain JS objects

    // Optional: check if orders exist
    if (!orders || orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    // Log full error for debugging
    console.error("GET MY ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
      error: error,
    });
  }
};


//cancel a order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled now" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  cancelOrder,
  updateOrderStatus,
  fetchSingleOrder
};
