import { useNavigate } from "react-router-dom";
import AboutCard from "./AboutCard";
import StatsCard from "./Stats";
import { Leaf, Sprout, Recycle } from "lucide-react";
import { useSelector } from "react-redux";

export default function AboutSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  return (
    <section className="bg-green-50 py-16 px-6 md:px-12 lg:px-24">
      {/* Top Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700">
          About <span className="text-green-500">GreenBasket</span>
        </h2>
        <p className="mt-4 text-gray-700 text-lg leading-relaxed">
          GreenBasket is an online farm-to-door marketplace designed to empower
          farmers and deliver fresh, chemical-free produce directly to
          customers. Our mission is to support local agriculture, reduce
          wastage, and promote healthier living.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-14">
        <AboutCard
          icon={<Leaf size={36} />}
          title="Fresh & Organic"
          description="We ensure every product is pesticide-free, naturally grown, and ethically sourced."
        />

        <AboutCard
          icon={<Sprout size={36} />}
          title="Empowering Farmers"
          description="We help farmers earn fair prices by cutting middlemen and providing digital reach."
        />

        <AboutCard
          icon={<Recycle size={36} />}
          title="Sustainable Approach"
          description="Eco-friendly packaging, reduced carbon footprint, and minimal wastage."
        />
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-6 mt-16 text-center">
        <StatsCard number="4,800+" label="Happy Customers" />
        <StatsCard number="1,200+" label="Partner Farmers" />
        <StatsCard number="250+" label="Organic Products" />
        <StatsCard number="98%" label="Customer Satisfaction" />
      </div>

      {/* Bottom Text */}
      <div className="mt-14 text-center">
        <p className="text-gray-700 text-lg italic">
          “Eat fresh, stay healthy — support farmers, save nature.”
        </p>
        {
          !isAuthenticated ?
            <button onClick={() => navigate("/auth")} className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition">
              Join Us Today
            </button> : null
        }

      </div>
    </section>
  );
}
