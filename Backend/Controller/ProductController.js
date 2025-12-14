const Product = require("../Model/ProductModel");
const cloudinary = require("../Utility/cloudniary.js")



const CreateProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!name || !category || !price || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details."
            });
        }

        let imageUrl = "";

        // If image file exists, upload to Cloudinary
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream(
                    { folder: "farm_products" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
                upload.end(req.file.buffer);
            });

            imageUrl = uploadResult.secure_url;
        }

        // Create product
        const product = await Product.create({
            name,
            category,
            price,
            description,
            image: imageUrl, // store image URL from Cloudinary
            farmer: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });

        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this product"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product
const DeleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ success: false, message: "Product not found." });

        if (product.farmer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this product"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// fetch Farmer All products
const farmerAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user.id })
            .populate("farmer", "email name");

        res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            products
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// fetch single product
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("farmer", "email name phone");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product fetched successfully.",
            product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllApprovedProducts = async (req, res) => {
    res.status(200).json(await Product.find({ isApproved: true }).populate("farmer"));
};

// getAllProducts
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("farmer", "email name");

        res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            products
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}





module.exports = {
    CreateProduct,
    updateProduct,
    DeleteProduct,
    farmerAllProducts,
    getSingleProduct,
    getAllApprovedProducts,
    getAllProducts
};
