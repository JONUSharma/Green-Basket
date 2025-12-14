const express = require("express")
const {
    getAllFarmers, updateFarmerStatus,
    getPendingProducts,
    approveProduct,
    rejectProduct,
    getAllUsers,
    deleteUser,
    getAllRetailer,
    getAllProducts,
    AdminUpdateProduct,
    getSingleUser,
} = require("../Controller/AdminController")
const { protect, adminOnly } = require("../middleware/authmiddleware.js")
const A_route = express.Router()

// Users
A_route.get("/users", protect, adminOnly, getAllUsers);
A_route.get("/user/:id", protect, adminOnly, getSingleUser);
A_route.delete("/users/:id", protect, adminOnly, deleteUser);

// Farmers
A_route.get("/farmers", protect, adminOnly, getAllFarmers);
A_route.get("/retailers", protect, adminOnly, getAllRetailer);
A_route.put("/farmers/status", protect, adminOnly, updateFarmerStatus);

// Product approval
A_route.get("/products", protect, adminOnly, getAllProducts);
A_route.put("/product-update/:id", protect, adminOnly, AdminUpdateProduct);
A_route.get("/product-pending", protect, adminOnly, getPendingProducts);
A_route.put("/product-approve/:id", protect, adminOnly, approveProduct);
A_route.delete("/product-reject/:id", protect, adminOnly, rejectProduct);

module.exports = A_route