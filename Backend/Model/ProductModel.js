const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum : ["fruits", "vegetables", "dairy"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default :""
        },
        farmer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        isApproved : {
            type : Boolean,
            default : false
        },
    },
    {
        timestamps: true,
    }
)
const product = mongoose.model("Product", ProductSchema)
module.exports = product