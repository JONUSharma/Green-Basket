import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../Axios/Instance";
import { Minus, Plus, ArrowRight, ArrowLeft } from "lucide-react";

const Checkout = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        instance
            .get(`/product/single-product/${productId}`)
            .then(res => setProduct(res.data.product));
    }, [productId]);

    if (!product)
        return (
            <div className="text-center mt-10 text-green-600 animate-pulse">
                Loading product...
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

            {/* LEFT – Product Details */}
            <div className="md:col-span-2 bg-white shadow-lg rounded-2xl p-6 space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-green-700 mb-4 hover:underline"
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Checkout
                </h1>

                <div className="flex gap-6 items-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-xl shadow"
                    />

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-gray-600">{product.category}</p>
                        <p className="text-green-700 text-xl font-bold">
                            ₹{product.price}
                        </p>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="p-2 border rounded-lg hover:bg-gray-100"
                            >
                                <Minus size={16} />
                            </button>

                            <span className="font-semibold">{quantity}</span>

                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="p-2 border rounded-lg hover:bg-gray-100"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT – Order Summary */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Price ({quantity} item)</span>
                        <span>₹{product.price * quantity}</span>
                    </div>

                    <div className="flex justify-between text-green-600">
                        <span>Delivery Charges</span>
                        <span>FREE</span>
                    </div>

                    <hr />

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>₹{product.price * quantity}</span>
                    </div>
                </div>

                <button
                    onClick={() =>
                        navigate("/payment", {
                            state: { product, quantity },
                        })
                    }
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                    Proceed to Payment
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Checkout;
