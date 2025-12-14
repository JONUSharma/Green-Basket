// src/components/HowItWorksSection.jsx
import React from 'react';
import { Tractor, ShoppingBag, Truck, DollarSign } from 'lucide-react';

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

export default HowItWorksSection;