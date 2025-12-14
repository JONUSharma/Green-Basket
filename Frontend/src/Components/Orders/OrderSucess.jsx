import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { order } = state;

  return (
    <div className="max-w-xl mx-auto p-6 text-center space-y-4">
      <h1 className="text-3xl font-bold text-green-600">Order Placed 🎉</h1>

      <p>Order ID: {order._id}</p>
      <p>Total: ₹{order.totalPrice}</p>

      <button
        onClick={() => navigate("/orders")}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;
