import { useEffect, useState } from "react";
import instance from "../../Axios/Instance";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    instance.get("/order/my-orders").then(res => {
      setOrders(res.data.orders);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">
        My Orders
      </h1>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm">Start shopping to see your orders here</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            className="flex items-center justify-between bg-white shadow-md rounded-2xl p-5 cursor-pointer hover:shadow-lg transition"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <img
                src={order.product?.image}
                alt={order.name}
                className="w-20 h-20 object-cover rounded-xl border"
              />

              <div className="space-y-1">
                <h2 className="font-semibold text-gray-800">
                  {order.name}
                </h2>

                <p className="text-sm text-gray-500">
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              <p className="font-semibold text-green-700 text-lg">
                ₹{order.totalPrice}
              </p>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
