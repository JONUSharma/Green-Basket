import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../Axios/Instance";
import { useState } from "react";
import { toast } from "sonner";

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { product, quantity } = state;

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        if (Object.values(address).some(v => !v)) {
            return toast.error("Please fill complete address");
        }

        try {
            setLoading(true);

            const res = await instance.post("/order/create", {
                productId: product._id,
                quantity,
                address,
            });

            navigate("/order-success", {
                state: { order: res.data.order },
            });
        } catch (err) {
            alert("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">

            

            {/* LEFT – Address */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>

                <div className=" flex flex-col space-y-5">
                    <input
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="input shadow-sm rounded-xl p-3"
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        className="input shadow-sm rounded-xl p-3"
                    />

                    <input
                        name="street"
                        placeholder="Street / House No"
                        onChange={handleChange}
                        className="input shadow-sm rounded-xl p-3"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="city"
                            placeholder="City"
                            onChange={handleChange}
                           className="input shadow-sm rounded-xl p-3"
                        />
                        <input
                            name="state"
                            placeholder="State"
                            onChange={handleChange}
                            className="input shadow-sm rounded-xl p-3"
                        />
                    </div>

                    <input
                        name="pincode"
                        placeholder="Pincode"
                        onChange={handleChange}
                        className="input shadow-sm rounded-xl p-3"
                    />
                </div>
            </div>

            {/* RIGHT – Order Summary */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="flex gap-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-gray-600">
                            ₹{product.price} × {quantity}
                        </p>
                    </div>
                </div>

                <hr />

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{product.price * quantity}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Delivery</span>
                        <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{product.price * quantity}</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="border rounded-xl p-4 space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" checked readOnly />
                        Cash on Delivery
                    </label>
                    <p className="text-sm text-gray-500">
                        Online payment coming soon
                    </p>
                </div>

                <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </div>
        </div>
    );
};

export default Payment;
