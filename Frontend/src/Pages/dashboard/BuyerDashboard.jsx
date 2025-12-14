// src/pages/BuyerDashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, DollarSign, Truck, Lightbulb } from 'lucide-react';
import MetricCard from '../../Components/dashboard/MetricCard.jsx';
import OrdersTable from '../../Components/dashboard/OrderTable.jsx';
import { generateDescription } from '../../api/geminiUitility.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, cancelOrder } from '../../Store/Order/OrderSlice.jsx';
import { ConfirmDialog } from '../../Components/Admin/ConfirmDialog.jsx';

const BuyerDashboard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const { orders, loading } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);
    const [insights, setInsights] = useState('');
    const [confirm, serConfirm] = useState({ open: false, fn: null, title: '' });
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    const handleGetInsights = async () => {
        setIsLoadingInsights(true);
        setInsights('Analyzing order data... this may take a moment.');

        const systemInstruction = "You are a business intelligence assistant for a retail buyer. Analyze the provided JSON order history (focus on totals, items, and status) and provide a single-paragraph summary (max 4 sentences). Identify the overall buying trend (e.g., spending level, frequency) and offer one clear, actionable suggestion for inventory management or future purchasing strategy. Do not use markdown, lists, or titles.";
        const userQuery = `Analyze the following order history (JSON string):\n${JSON.stringify(orders, null, 2)}`;

        const generatedText = await generateDescription(systemInstruction, userQuery);
        setInsights(generatedText);
        setIsLoadingInsights(false);
    };

    return (
        <div className="space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricCard icon={ShoppingBag} title="Total Orders" value={orders.length} color="text-green-600" />
                <MetricCard icon={DollarSign} title="Total Spent" value={`₹${orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}`} color="text-blue-600" />
                <MetricCard icon={Truck} title="Orders Shipped" value={orders.filter(o => o.status === 'shipped' || o.status === 'Delivered').length} color="text-yellow-600" />
                <MetricCard icon={Truck} title="Orders Cancelled" value={orders.filter(o => o.status === 'cancelled').length} color="text-red-600" />
                <MetricCard icon={Truck} title="Orders Pending" value={orders.filter(o => o.status === 'pending').length} color="text-blue-600" />
            </div>

            {/* AI Insights & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Insights Panel (1/3 width) */}
                <div className="lg:col-span-1 bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-200 h-fit">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                        <Lightbulb size={24} className="mr-2" /> Buying Insights
                    </h2>
                    <button
                        onClick={handleGetInsights}
                        disabled={isLoadingInsights}
                        className="w-full py-2 mb-4 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center
                            bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait"
                    >
                        {isLoadingInsights ? 'Analyzing...' : '✨ Generate Buying Insights'}
                    </button>
                    <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-blue-100 min-h-[100px] whitespace-pre-wrap">
                        {insights || "Click 'Generate Buying Insights' to get an AI-powered summary and actionable suggestions based on your past purchases."}
                    </p>
                </div>

                {/* Recent Orders Table (2/3 width) */}
                <OrdersTable
                    orders={orders}
                    onCancel={(id) =>{
                        serConfirm({
                            open: true,
                            title: "Are you sure you want to cancel this order?",
                            fn: async () => {
                                await dispatch(cancelOrder(id));
                                window.location.reload();
                            },
                        });
                    } }
                />
            </div>
              <ConfirmDialog open={confirm.open} title={confirm.title} onCancel={() => serConfirm({ open: false, fn: null, title: '' })} onConfirm={async () => { if (confirm.fn) await confirm.fn(); }} />
        
        </div>
    );
};

export default BuyerDashboard;