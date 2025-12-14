// src/components/dashboard/MetricCard.jsx
import React from 'react';

const MetricCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-green-50 ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    </div>
);

export default MetricCard;