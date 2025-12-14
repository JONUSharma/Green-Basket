import { ShoppingBag, DollarSign, Truck, Lightbulb } from 'lucide-react';
const OrdersTable = ({ orders, onCancel }) => {
    const getStatusBadge = (status) => {
        const classes = {
            delivered: "bg-green-100 text-green-800",
            shipped: "bg-blue-100 text-blue-800",
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-purple-100 text-purple-800",
            cancelled: "bg-red-100 text-red-800",
        };

        return classes[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <ShoppingBag size={24} className="mr-2" /> Recent Orders
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Order ID</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.map((order) => (
                            <tr key={order._id} className="hover:bg-green-50 transition-colors">
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalPrice}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">₹{order.total.toLocaleString()}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm hover:scale-110 hover:text-md text-red-400" >
                                     {order.status === "pending" && (
                                    <button
                                        onClick={()=> onCancel(order._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Cancel
                                    </button>
                                )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
