import { Truck, DollarSign, Tractor} from 'lucide-react';
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

export default Footer;