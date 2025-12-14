// src/components/auth/RoleCard.jsx
import React from 'react';

const RoleCard = ({ title, description, icon: Icon, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`p-5 border-2 rounded-xl cursor-pointer transition-all flex items-start space-x-4
            ${isSelected ? 'border-green-500 ring-4 ring-green-200 bg-green-50' : 'border-gray-200 hover:border-green-400'}`}
    >
        <Icon size={30} className={isSelected ? 'text-green-600' : 'text-gray-500'} />
        <div>
            <h3 className="font-semibold text-lg text-green-800">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
);

export default RoleCard;