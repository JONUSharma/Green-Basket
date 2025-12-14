import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/auth" />;

  // allow time for redux to rehydrate
  if (token && !isAuthenticated && !user) {
    return <p className="text-green-400 font-semibold m-5">Loading...</p>;
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
