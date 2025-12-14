import { Link } from "react-router-dom"
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
        <div>
        <Link to="/products" className="bg-lime-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-lime-400 transition-all transform hover:scale-105">
          Explore Products Today
        </Link>
        </div>
      </div>

      {/* Optional soft bottom gradient for smooth blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
export default Hero;