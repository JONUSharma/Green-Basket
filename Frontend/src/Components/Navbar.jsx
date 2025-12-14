import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/UserThunk/AuthSlice.jsx";
import { Leaf, ShoppingBag, User, Menu, X, Headset } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [mobileView, setMobileView] = useState(false);
  const dispatch = useDispatch();

  const closeMenu = () => setMobileView(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 font-medium">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-2xl">
          {/* <Leaf className="w-6 h-6" /> */}
          <img src="/logo1.png" className="w-1/2 h-[50px]" alt="logo" />
          GreenBasket
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          <Link to="/" className="hover:text-green-700 transition flex items-center gap-1"><User size={20}/>Home</Link>
          <Link to="/products" className="hover:text-green-700 transition flex items-center gap-1">
            <ShoppingBag size={18} /> Products
          </Link>
          <Link to="/about" className="hover:text-green-700 transition flex items-center gap-1"><User size={20}/>About</Link>
          <Link to="/contact" className="hover:text-green-700 transition flex items-center gap-1"><Headset size={20}/>Contact Us</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-green-700 transition flex items-center gap-1">
                <User size={18} /> Dashboard
              </Link>
              <button
                onClick={() =>{ dispatch(logout());
                  toast.info("Logout successful");
                }}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Login / Signup
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileView(!mobileView)} className="md:hidden text-green-700">
          {mobileView ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileView && (
        <div className="md:hidden flex flex-col gap-5 bg-white px-6 py-6 border-t border-green-200 animate-slideDown">
          <Link onClick={closeMenu} to="/" className="hover:text-green-700 transition flex items-center gap-2"><User size={20}/>Home</Link>
          <Link onClick={closeMenu} to="/products" className="hover:text-green-700 transition flex items-center gap-2">
            <ShoppingBag size={18} /> Products
          </Link>
          <Link onClick={closeMenu} to="/about" className="hover:text-green-700 transition flex items-center gap-2"><User size={20}/>About</Link>
          <Link onClick={closeMenu} to="/contact" className="hover:text-green-700 transition flex items-center gap-2"><Headset size={20}/>Contact Us</Link>

          {isAuthenticated ? (
            <>
              <Link onClick={closeMenu} to="/dashboard" className="hover:text-green-700 transition flex items-center gap-2">
                <User size={18} /> Dashboard
              </Link>

              <button
                onClick={() => {
                  dispatch(logout());
                  closeMenu();
                }}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout / Signup
              </button>
            </>
          ) : (
            <Link
              onClick={closeMenu}
              to="/auth"
              className="px-5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
