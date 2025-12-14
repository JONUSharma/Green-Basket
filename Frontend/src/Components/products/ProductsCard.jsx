// src/components/products/ProductCard.jsx
import React from 'react';
import { ShoppingBag, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProductCard = ({ product, }) => {
    const { user } = useSelector((s) => s.auth);
    const navigate = useNavigate();
    const handleBuy = (productName) => {
        // Using a temporary modal instead of alert for better UI/UX
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); text-align: center; max-width: 300px;">
              <p style="font-size: 1.1em; font-weight: 600; color: #10b981; margin-bottom: 15px;">🛒 Added to Cart!</p>
              <p style="color: #4b5563;">${productName} is ready to order.</p>
              <button onclick="this.parentNode.parentNode.remove()" style="margin-top: 20px; padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer;">OK</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
    };

    return (
        <div
            className="bg-white border border-green-200 rounded-2xl shadow-xl overflow-hidden transition duration-300 transform hover:shadow-2xl hover:-translate-y-1 group"
        >
            <img
                src={product.image}
                alt={product.name}
                onError={(e) => e.target.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Missing"}
                className="h-44 w-full object-cover rounded-t-2xl group-hover:opacity-90 transition-opacity"
                loading="lazy"
            />
            <div className="p-5 text-center flex flex-col items-center" key={product.key}>
                <h3 className="font-bold text-xl text-green-900 mb-2">{product.name}</h3>
                <p className="text-2xl text-green-700 font-extrabold mb-4">
                    ₹{product.price} / {product.unit}
                </p>

                {user?.role ? (
                    <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="mt-2 w-full flex justify-center items-center bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        disabled={user?.role === 'farmer'}
                    >
                        <ShoppingBag size={20} className="mr-2" />
                        Buy Now
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/auth')}
                        className="mt-2 w-full bg-yellow-500 text-gray-900 py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600 transition-colors"
                    >
                        <LogIn size={20} className="mr-2 inline-block" /> Login to Buy
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;