// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { ShoppingBag, Tractor } from 'lucide-react';
import RoleCard from '../components/auth/RoleCard.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthPage = ({ onLogin, navigate }) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRole) {
            onLogin(selectedRole);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-green-50">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-green-200">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Join the Green Basket</h2>
                <p className="text-center text-gray-600 mb-6">Select your role to continue.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Buyer Role */}
                        <RoleCard
                            role="buyer"
                            title="Retailer / Buyer"
                            description="Browse products, place orders, and manage shipments."
                            icon={ShoppingBag}
                            isSelected={selectedRole === 'buyer'}
                            onClick={() => setSelectedRole('buyer')}
                        />
                        {/* Farmer Role */}
                        <RoleCard
                            role="farmer"
                            title="Farmer / Producer"
                            description="Upload your harvest, set prices, and manage sales."
                            icon={Tractor}
                            isSelected={selectedRole === 'farmer'}
                            onClick={() => setSelectedRole('farmer')}
                        />
                    </div>
                    {
                        token ?
                            <button
                                type="submit"
                                disabled={!selectedRole}
                                className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedRole
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Login as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
                            </button>
                             :
                            <button
                                type="submit"
                                disabled={!selectedRole}
                                className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedRole
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Login as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
                            </button>
                        
                    }

                </form>

                <button onClick={() => navigate('home')} className="mt-6 w-full text-center text-sm text-green-600 hover:text-green-800 transition-colors">
                    &larr; Back to Homepage
                </button>
                <button onClick={() => navigate('auth-page')} className="mt-6 w-full text-center text-sm text-green-600 hover:text-green-800 transition-colors">
                    &rarr; Create a new Account
                </button>
            </div>
        </div>
    );
};

export default AuthPage;