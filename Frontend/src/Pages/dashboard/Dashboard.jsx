// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import FarmerDashboard from './FarmerDashboard.jsx';
import BuyerDashboard from './BuyerDashboard.jsx';
import AdminPanel from './AdminDashboard.jsx';

const DashboardPage = ({ products, onProductUpload }) => {
    const { isLoading } = useSelector((state) => state.auth);
    const user = localStorage.getItem("user")
    if (!user) return <div className="p-8 text-center text-red-500">Please log in to view the dashboard.</div>;



    const username = JSON.parse(user).name;
    const role = JSON.parse(user).role;

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 mt-4">
            <div className="bg-white p-6 rounded-xl shadow-xl border border-green-100">
                <h1 className="text-4xl font-extrabold text-green-800 mb-2 flex items-center">
                    <User size={36} className="mr-3 text-green-600" />
                    Welcome back, {username}!
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                    You are logged in as a <span className="font-bold capitalize text-green-700">{role}</span>.
                </p>

                {
                    role === 'farmer' ?
                        (<FarmerDashboard user={user} products={products} onProductUpload={onProductUpload} />) :
                        role === "retailer" ? (<BuyerDashboard user={user} />) :
                            role === "admin" ? (<AdminPanel />) : null
                }
            </div>
        </div>
    );
};

export default DashboardPage;