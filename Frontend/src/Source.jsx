import React, { useState, useMemo } from 'react';
import { LogIn, LogOut, Menu, X, Package, ShoppingBag, Truck, DollarSign, CloudUpload, Tractor, Home, User, Lightbulb } from 'lucide-react';

// ==============================================================================
// 📦 --- UTILITIES (Conceptual: utilities/GeminiUtility.js) ---
// ==============================================================================

const API_KEY = ""; // Leave as empty string. Canvas provides the key at runtime.
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// Utility function to call the Gemini API with exponential backoff
async function callGeminiAPI(systemInstruction, userQuery, maxRetries = 5) {
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    tools: [{ "google_search": {} }],
  };

  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return text || 'Generation failed.';

    } catch (error) {
      if (i < maxRetries - 1 && error.message.includes('Rate limit')) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        console.error("Gemini API Error:", error);
        return 'Error generating content. Please try again.';
      }
    }
  }
}

// ==============================================================================
// 📦 --- CORE DATA (Conceptual: data/mockData.js) ---
// ==============================================================================

const initialProducts = [
  { id: 1, name: "Fresh Tomatoes", price: 40, unit: "kg", img: "https://placehold.co/150x150/538d4e/ffffff?text=Tomatoes", sellerId: 'farmerA' },
  { id: 2, name: "Organic Mangoes", price: 90, unit: "unit", img: "https://placehold.co/150x150/f0b400/000000?text=Mangoes", sellerId: 'farmerA' },
  { id: 3, name: "Red Onions", price: 30, unit: "kg", img: "https://placehold.co/150x150/d63031/ffffff?text=Onions", sellerId: 'farmerB' },
  { id: 4, name: "Watermelon (Fresh)", price: 250, unit: "piece", img: "https://placehold.co/150x150/00b894/ffffff?text=Watermelon", sellerId: 'farmerC' },
];


// ==============================================================================
// ⚛️ --- COMPONENTS (Conceptual: components/) ---
// ==============================================================================

// Conceptual: components/Navbar.jsx
const Navbar = ({ user, role, navigate, onLogout, currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', target: 'home', icon: Home, visible: true },
    { name: 'Products', target: 'products', icon: Package, visible: true },
    { name: 'Dashboard', target: 'dashboard', icon: User, visible: !!user },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-100 via-emerald-50 to-lime-100 shadow-lg sticky top-0 z-50 border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate('home')}
          className="text-2xl font-extrabold text-green-800 flex items-center gap-2 transform transition-transform hover:scale-105"
        >
          🌿 <span className="tracking-wide">Green Basket</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 font-medium text-green-800 items-center">
          {navItems.filter(item => item.visible).map(item => (
            <button
              key={item.name}
              onClick={() => navigate(item.target)}
              className={`hover:text-green-600 transition-colors py-1 px-2 rounded-lg ${currentPage === item.target ? 'bg-green-200 text-green-800' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Auth/User Action Button */}
        <div className="hidden md:flex space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-green-700 bg-green-200 px-3 py-1 rounded-full capitalize">
                {role}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('auth')}
              className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg shadow-xl hover:bg-green-800 transition-all"
            >
              <LogIn size={18} className="mr-2" /> Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-green-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-50 border-t border-green-200 shadow-inner">
          <div className="flex flex-col items-stretch py-4 space-y-2 font-medium text-green-800 px-4">
            {navItems.filter(item => item.visible).map(item => (
                <button
                    key={item.name}
                    onClick={() => { navigate(item.target); setMenuOpen(false); }}
                    className="flex items-center p-3 rounded-lg hover:bg-green-200 transition-colors"
                >
                    <item.icon size={20} className="mr-3" /> {item.name}
                </button>
            ))}

            {user ? (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-100 mt-2">
                  <span className="text-sm font-semibold capitalize">{role} Account</span>
                  <span className="text-xs text-green-600">Hi, {user.name}</span>
                </div>
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="flex items-center justify-center mt-2 w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate('auth'); setMenuOpen(false); }}
                className="flex items-center justify-center mt-2 w-full p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md"
              >
                <LogIn size={18} className="mr-2" /> Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Conceptual: components/Hero.jsx
const Hero = ({ navigate }) => {
  return (
    <section
      className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1470&q=80")`,
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-green-900/50"></div>

      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Empowering Farmers. Connecting Buyers.
        </h1>
        <p className="text-lg md:text-xl mb-8 text-green-100 max-w-3xl mx-auto">
          Bringing fresh produce directly from farms to your business with guaranteed quality and fair pricing.
        </p>
        <button
          onClick={() => navigate('products')}
          className="bg-lime-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-lime-400 transition-all transform hover:scale-105"
        >
          Explore Products Today
        </button>
      </div>

      {/* Optional soft bottom gradient for smooth blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

// Conceptual: components/Footer.jsx
const Footer = () => {
    return (
        <footer id="contact" className="bg-gray-800 text-gray-300 py-8">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-lg font-semibold mb-2 text-white">Green Basket © 2025</p>
                <p className="text-sm">
                    Made with ❤️ for farmers and retailers | All rights reserved.
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                    <Truck size={20} className="text-green-400" />
                    <Tractor size={20} className="text-green-400" />
                    <DollarSign size={20} className="text-green-400" />
                </div>
            </div>
        </footer>
    );
};

// Conceptual: components/HowItWorksSection.jsx
const HowItWorksSection = () => {
    const steps = [
        { icon: Tractor, title: "Farmers Upload", description: "Producers list their fresh crops with quality details and pricing." },
        { icon: ShoppingBag, title: "Buyers Order", description: "Retailers browse the marketplace and place bulk orders easily." },
        { icon: Truck, title: "Efficient Logistics", description: "We arrange reliable transportation directly from farm to destination." },
        { icon: DollarSign, title: "Fair Payment", description: "Secure, prompt payment systems ensure trust for all parties." },
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl shadow-lg border border-green-200">
                    <div className="p-4 bg-green-200 rounded-full mb-4 text-green-700">
                        <step.icon size={30} />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                </div>
            ))}
        </div>
    );
};

// Conceptual: components/auth/RoleCard.jsx
const RoleCard = ({ role, title, description, icon: Icon, isSelected, onClick }) => (
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

// Conceptual: components/dashboard/MetricCard.jsx
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

// Conceptual: components/products/ProductCard.jsx
const ProductCard = ({ product, userRole, navigate }) => {
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
            key={product.id}
            className="bg-white border border-green-200 rounded-2xl shadow-xl overflow-hidden transition duration-300 transform hover:shadow-2xl hover:-translate-y-1 group"
        >
            <img
                src={product.img}
                alt={product.name}
                onError={(e) => e.target.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Missing"}
                className="h-44 w-full object-cover rounded-t-2xl group-hover:opacity-90 transition-opacity"
                loading="lazy"
            />
            <div className="p-5 text-center flex flex-col items-center">
                <h3 className="font-bold text-xl text-green-900 mb-2">{product.name}</h3>
                <p className="text-2xl text-green-700 font-extrabold mb-4">
                    ₹{product.price} / {product.unit}
                </p>
                
                {userRole ? (
                    <button
                        onClick={() => handleBuy(product.name)}
                        className="mt-2 w-full flex justify-center items-center bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        disabled={userRole === 'farmer'} 
                    >
                        <ShoppingBag size={20} className="mr-2" />
                        Buy Now
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('auth')}
                        className="mt-2 w-full bg-yellow-500 text-gray-900 py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600 transition-colors"
                    >
                        <LogIn size={20} className="mr-2 inline-block" /> Login to Buy
                    </button>
                )}
            </div>
        </div>
    );
};


// ==============================================================================
// ⚛️ --- PAGES (Conceptual: pages/) ---
// ==============================================================================

// Conceptual: pages/Auth.jsx
const Auth = ({ onLogin, navigate }) => {
    const [selectedRole, setSelectedRole] = useState(null);

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

                    <button
                        type="submit"
                        disabled={!selectedRole}
                        className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${
                            selectedRole
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Login as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
                    </button>
                </form>

                <button onClick={() => navigate('home')} className="mt-6 w-full text-center text-sm text-green-600 hover:text-green-800 transition-colors">
                    &larr; Back to Homepage
                </button>
            </div>
        </div>
    );
};

// Conceptual: pages/ProductsPage.jsx
const ProductsPage = ({ products, userRole, navigate }) => {
    return (
        <section id="products-list" className="py-16 bg-white">
            <h2 className="text-4xl font-extrabold text-center mb-12 text-green-800">
                🌱 Freshly Harvested Produce
            </h2>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} userRole={userRole} navigate={navigate} />
                ))}
            </div>
        </section>
    );
};

// Conceptual: pages/dashboards/FarmerDashboard.jsx
const FarmerDashboard = ({ user, products, onProductUpload }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('kg');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const farmersProducts = products.filter(p => p.sellerId === user.id);

    const handleGenerateDescription = async () => {
        if (!name || !price) {
             const modal = document.createElement('div');
             modal.innerHTML = `
               <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
                 <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); text-align: center; max-width: 300px;">
                   <p style="font-size: 1.1em; font-weight: 600; color: #dc2626; margin-bottom: 15px;">Missing Info</p>
                   <p style="color: #4b5563;">Please enter the Crop Name and Price before generating a description.</p>
                   <button onclick="this.parentNode.parentNode.remove()" style="margin-top: 20px; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer;">OK</button>
                 </div>
               </div>
             `;
             document.body.appendChild(modal);
             return;
        }

        setIsGeneratingDesc(true);
        const systemInstruction = "You are a professional agricultural copywriter. Generate a concise (max 3 sentences) and compelling marketing description for this farm product, focusing on quality, freshness, and the unit price. Do not include any titles, markdown, or greetings.";
        const userQuery = `Generate a description for: Product Name: ${name}, Price: ₹${price} per ${unit}.`;
        
        const generatedText = await callGeminiAPI(systemInstruction, userQuery);
        setDescription(generatedText);
        setIsGeneratingDesc(false);
    };


    const handleUpload = (e) => {
        e.preventDefault();
        if (!name || !price) return;

        setIsSubmitting(true);
        setTimeout(() => { // Simulate API call delay
            const newProduct = {
                name,
                price: parseFloat(price),
                unit,
                description, // Include the generated description
                img: `https://placehold.co/150x150/538d4e/ffffff?text=${name.split(' ')[0]}`
            };
            onProductUpload(newProduct);
            
            // Reset form
            setName('');
            setPrice('');
            setUnit('kg');
            setDescription('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Form (2/3 width on desktop) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-yellow-200 h-fit">
                <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center">
                    <CloudUpload size={24} className="mr-2" /> Upload New Crop
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Crop Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., Organic Red Chillies"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                min="0.01"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
                                placeholder="45.00"
                            />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                            <select
                                id="unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500 bg-white"
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="unit">Unit/Piece</option>
                                <option value="quintal">Quintal</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Product Description</label>
                            <button 
                                type="button" 
                                onClick={handleGenerateDescription}
                                disabled={isGeneratingDesc}
                                className="text-xs font-semibold text-white px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-wait flex items-center"
                            >
                                {isGeneratingDesc ? 'Generating...' : '✨ AI Generate'}
                            </button>
                        </div>
                        <textarea
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
                            placeholder="A brief, appealing description of your harvest..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !name || !price}
                        className="w-full py-3 rounded-xl font-bold text-lg transition-all shadow-md mt-4 flex items-center justify-center
                            bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>Uploading...</>
                        ) : (
                            <><CloudUpload size={20} className="mr-2" /> Upload Harvest</>
                        )}
                    </button>
                </form>
            </div>

            {/* My Listings (1/3 width on desktop) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-green-200">
                <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                    <Package size={24} className="mr-2" /> My Listings ({farmersProducts.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {farmersProducts.length > 0 ? (
                        farmersProducts.map(p => (
                            <div key={p.id} className="p-3 bg-green-50 rounded-lg flex justify-between items-center border border-green-100">
                                <div>
                                    <p className="font-semibold text-green-800">{p.name}</p>
                                    <p className="text-sm text-gray-500">₹{p.price} / {p.unit}</p>
                                </div>
                                <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">You have no active listings. Upload your first crop!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Conceptual: pages/dashboards/BuyerDashboard.jsx
const BuyerDashboard = ({ user }) => {
    // Mock orders data
    const orders = useMemo(() => [
        { id: 'ORD001', date: '2025-09-01', total: 4500, status: 'Shipped', items: 3 },
        { id: 'ORD002', date: '2025-09-15', total: 1280, status: 'Delivered', items: 1 },
        { id: 'ORD003', date: '2025-10-05', total: 7200, status: 'Processing', items: 5 },
        { id: 'ORD004', date: '2025-11-01', total: 500, status: 'Processing', items: 2 },
    ], []);

    const [insights, setInsights] = useState('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    const handleGetInsights = async () => {
        setIsLoadingInsights(true);
        setInsights('Analyzing order data... this may take a moment.');

        const systemInstruction = "You are a business intelligence assistant for a retail buyer. Analyze the provided JSON order history (focus on totals, items, and status) and provide a single-paragraph summary (max 4 sentences). Identify the overall buying trend (e.g., spending level, frequency) and offer one clear, actionable suggestion for inventory management or future purchasing strategy. Do not use markdown, lists, or titles.";
        const userQuery = `Analyze the following order history (JSON string):\n${JSON.stringify(orders, null, 2)}`;
        
        const generatedText = await callGeminiAPI(systemInstruction, userQuery);
        setInsights(generatedText);
        setIsLoadingInsights(false);
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-400';
            case 'Shipped': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-400';
            default: return 'bg-gray-100 text-gray-600 border-gray-400';
        }
    };

    return (
        <div className="space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricCard icon={ShoppingBag} title="Total Orders" value={orders.length} color="text-green-600" />
                <MetricCard icon={DollarSign} title="Total Spent" value={`₹${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`} color="text-blue-600" />
                <MetricCard icon={Truck} title="Orders Shipped" value={orders.filter(o => o.status === 'Shipped' || o.status === 'Delivered').length} color="text-yellow-600" />
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
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-green-200">
                    <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                        <ShoppingBag size={24} className="mr-2" /> Recent Orders
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-green-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">₹{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ==============================================================================
// 🚀 --- MAIN APP (Conceptual: App.jsx) ---
// ==============================================================================

function App() {
  // Global App State
  const [user, setUser] = useState(null); // null or { id: 'user123', name: 'Gyan' }
  const [role, setRole] = useState(null); // null, 'buyer', or 'farmer'
  const [page, setPage] = useState('home'); // 'home', 'auth', 'dashboard', 'products'
  const [products, setProducts] = useState(initialProducts);

  const handleLogin = (selectedRole) => {
    // Simulate successful login for a user named Gyan with a unique ID
    setUser({ id: 'user-' + Date.now(), name: 'Gyan' });
    setRole(selectedRole);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    setPage('home');
  };

  const handleProductUpload = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: products.length + 1,
      sellerId: user.id
    };
    setProducts(prev => [...prev, productWithId]);
    setPage('products');
  };

  const navigate = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (page) {
      case 'auth':
        return <Auth onLogin={handleLogin} navigate={navigate} />;
      case 'dashboard':
        if (!user) return <div className="p-8 text-center text-red-500">Please log in to view the dashboard.</div>;
        return (
            <div className="max-w-7xl mx-auto p-6 md:p-8 mt-4">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-green-100">
                    <h1 className="text-4xl font-extrabold text-green-800 mb-2 flex items-center">
                        <User size={36} className="mr-3 text-green-600" />
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        You are logged in as a <span className="font-bold capitalize text-green-700">{role}</span>.
                    </p>
                    {role === 'farmer' ? (
                        <FarmerDashboard user={user} products={products} onProductUpload={handleProductUpload} />
                    ) : (
                        <BuyerDashboard user={user} />
                    )}
                </div>
            </div>
        );
      case 'products':
        return <ProductsPage products={products} userRole={role} navigate={navigate} />;
      case 'home':
      default:
        return (
          <>
            <Hero navigate={navigate} />
            <ProductsPage products={products} userRole={role} navigate={navigate} />
            <div className="py-16 bg-white max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-10 text-green-700">How It Works</h2>
                <HowItWorksSection />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar
        user={user}
        role={role}
        navigate={navigate}
        onLogout={handleLogout}
        currentPage={page}
      />
      <main className="pb-16">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;