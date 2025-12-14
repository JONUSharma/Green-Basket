import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../../Axios/Instance";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { ConfirmDialog } from "../Admin/ConfirmDialog";

const statusBadge = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, fn: null, title: "" });

  useEffect(() => {
    instance.get(`/order/${id}`).then(res => {
      setOrder(res.data.order);
      setLoading(false);
    });
  }, [id]);

  const cancelOrder = async () => {
    setConfirm({
      open: true,
      title : "Cancel this order?",
      fn: async () => {
        await instance.put(`/order/cancel/${id}`);
        window.location.reload();
        setConfirm({ open: false, fn: null, title: "" });
      }
    })
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return <p className="text-center mt-10">Order not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">
          Order #{order._id.slice(-6)}
        </h1>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${statusBadge[order.status]}`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* PRODUCT CARD */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex gap-6">
        <img
          src={order.product.image}
          alt={order.product.name}
          className="w-32 h-32 object-cover rounded-xl border"
        />

        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {order.product.name}
          </h2>

          <p className="text-gray-500">
            Quantity: <b>{order.quantity}</b>
          </p>

          <p className="text-gray-500">
            Price: ₹{order.product.price}
          </p>

          <p className="text-gray-500">
            Ordered on:{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right text-lg font-semibold text-green-700">
          ₹{order.totalPrice}
        </div>
      </div>

      {/* ORDER TRACKING */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>

        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex flex-col items-center">
            <Package className="text-green-600" />
            <p>Ordered</p>
          </div>

          <div className="flex flex-col items-center">
            <Truck
              className={
                ["confirmed", "shipped", "delivered"].includes(order.status)
                  ? "text-green-600"
                  : "text-gray-300"
              }
            />
            <p>Shipped</p>
          </div>

          <div className="flex flex-col items-center">
            <CheckCircle
              className={
                order.status === "delivered"
                  ? "text-green-600"
                  : "text-gray-300"
              }
            />
            <p>Delivered</p>
          </div>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* BUYER */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-1">
          <h3 className="font-semibold text-lg mb-2">Buyer Details</h3>
          <p><b>Name:</b> {order.buyer.name}</p>
          <p><b>Email:</b> {order.buyer.email}</p>
          <p><b>Phone:</b> {order.buyer.phone}</p>
        </div>

        {/* FARMER */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-1">
          <h3 className="font-semibold text-lg mb-2">Farmer Details</h3>
          <p><b>Name:</b> {order.farmer.name}</p>
          <p><b>Email:</b> {order.farmer.email}</p>
          <p><b>Phone:</b> {order.farmer.phone}</p>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-2">Payment</h3>
        <p>
          Method:{" "}
          <span className="font-semibold uppercase text-green-700">
            {order.paymentMethod}
          </span>
        </p>
      </div>

      {/* ACTIONS */}
      {order.status === "pending" && (
        <div className="flex justify-end">
          <button
            onClick={cancelOrder}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"
          >
            <XCircle size={18} />
            Cancel Order
          </button>
        </div>
      )}
      <ConfirmDialog open={confirm.open} title={confirm.title} onCancel={() => setConfirm({ open: false, fn: null, title: '' })} onConfirm={async () => { if (confirm.fn) await confirm.fn(); }} />

    </div>
  );
};

export default OrderDetails;
