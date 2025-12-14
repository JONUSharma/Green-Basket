// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero.jsx';
import HowItWorksSection from '../components/HowItWorksSection.jsx';
import ProductsPage from './Products.jsx';
import AboutSection from '../Components/About/AboutSection.jsx';

const HomePage = ({ products, userRole, navigate }) => {
    return (
        <>
            <Hero navigate={navigate} />
            <ProductsPage products={products} userRole={userRole} navigate={navigate} />
            <div className="py-16 bg-white max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-10 text-green-700">How It Works</h2>
                <HowItWorksSection />
                <AboutSection/>
            </div>
        </>
    );
};

export default HomePage;