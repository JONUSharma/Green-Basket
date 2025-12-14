const express = require("express");
const { CreateProduct, DeleteProduct, updateProduct, farmerAllProducts, getSingleProduct, getAllApprovedProducts, getAllProducts } = require("../Controller/ProductController");
const { protect } = require("../middleware/authmiddleware");
const {upload} = require("../middleware/multer");
const P_route = express.Router();

P_route.post("/create-product",protect, upload.single("image"), CreateProduct);
P_route.delete("/delete-product/:id",protect, DeleteProduct);
P_route.post("/update-product/:id",protect, updateProduct);
P_route.get("/farmer-all-products",protect, farmerAllProducts);
P_route.get("/all-products",protect, getAllProducts);
P_route.get("/single-product/:id",protect, getSingleProduct);
P_route.get("/approved", getAllApprovedProducts);

module.exports = P_route
