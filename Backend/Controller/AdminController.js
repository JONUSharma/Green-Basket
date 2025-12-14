const User = require("../Model/UserModle");
const Product = require("../Model/ProductModel");
const getAllFarmers = async (req, res) => {
  const farmers = await User.find({ role: "farmer" });
  res.json(farmers);
};
const getAllRetailer = async (req, res) => {
  const retailer = await User.find({ role: "retailer" });
  res.json(retailer);
};

// get all the products
const getAllProducts = async (req, res) => {
  res.json(await Product.find());
}

const updateFarmerStatus = async (req, res) => {
  const { userId, status } = req.body;

  const updated = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );

  res.json(updated);
};

const getPendingProducts = async (req, res) => {
  const products = await Product.find({ isApproved: false }).populate("farmer");
  res.json(products);
};

const approveProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  res.json(updated);
};

const rejectProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product rejected and removed" });
};

// get all users
const getAllUsers = async (req, res) => {
  res.json(await User.find());
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const adminId = req.user._id;        
    const userId = req.params.id;        

    // ❌ Admin cannot delete himself
    if (adminId.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete himself",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ Admin cannot delete another admin
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another admin",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// update Products
const AdminUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get single user
const getSingleUser = async(req,res)=> {
  try {
    const user = await User.findById(req.params.id);
    if(!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllFarmers,
  getAllRetailer,
  AdminUpdateProduct,
  getAllProducts,
  updateFarmerStatus,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllUsers,
  deleteUser,
  getSingleUser
}