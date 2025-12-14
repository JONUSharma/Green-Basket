import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOtp, loginUser, clearError } from "../Store/UserThunk/AuthSlice.jsx";
import { useNavigate } from "react-router-dom";
// Component for the OTP verification screen
const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, error } = useSelector((s) => s.auth);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  })



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-center text-sm text-green-700">
        A 6-digit verification code has been sent to **{email}**.
      </p>
      <div>
        <label className="block text-sm font-medium text-green-800 mb-1">
          Verification Code (OTP)
        </label>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 text-center border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 tracking-widest text-lg"
          placeholder="E.g., 123456"
          maxLength="6"
          required
        />
      </div>


      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:bg-green-400"
      >
        {isLoading ? "Verifying..." : "Verify & Login"}
      </button>
    </form>
  );
};


// Main Authentication Component
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "retailer", phone: "",
  });

  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, error, isOtpSent, tempEmail, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');

    }
    dispatch(clearError());
  }, [isAuthenticated, isLogin, dispatch, user]);


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
      setFormData({ email: "", password: "", confirmPassword: "", role: "", phone: "" });
    } else {
      dispatch(registerUser(formData))
    }
  };

  if (isOtpSent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-300">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Verify Your Email ✉️</h2>
          <OtpVerification email={tempEmail} />
          <p className="text-center text-green-800 mt-4 text-sm">
            Didn't receive the code? Check spam or try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1573865174887-dd85bc60e3e5?w=600&auto=format&fit=crop&q=60')`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Auth Card */}
      <div className="relative bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-300 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          {isLogin ? "Welcome Back 🌿" : "Join Green Basket 🌱"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="retailer">Retailer</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>
            </>
          )}

          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <div className="relative w-full">
            <Input label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
            <button onClick={handleTogglePassword} className="absolute right-3 top-[40px] -translate-y-1/5 text-sm text-green-600" type="button">{showPassword ? "Hide" : "Show"}</button>
            
          </div>
          {!isLogin && (
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:bg-green-400"
          >
            {isLoading ? (isLogin ? "Logging in..." : "Signing Up...") : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>

        <p className="text-center text-green-800 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="text-green-700 font-semibold hover:underline ml-1">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

// Reusable Input Component
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-green-800 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      required
    />
  </div>
);



