import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import {Toaster} from "sonner"
import { useState } from "react";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Products from "./Pages/Products";
import ProtectedRoute from "./Components/ProtectedRoute";
import FarmerDashboard from "./Pages/dashboard/FarmerDashboard.jsx";
import BuyerDashboard from "./Pages/dashboard/BuyerDashboard.jsx";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import ProductDetails from "./Components/products/ProductDetails.jsx"
import { initialProducts } from './data/mockData.js';
import AboutSection from "./Components/About/AboutSection.jsx";
import ContactForm from "./Components/Contact.jsx";
import DashboardPage from "./Pages/dashboard/Dashboard.jsx";
import UserDetails from "./Components/Admin/UserDetail.jsx";
import MyOrders from "./Components/Orders/Orders.jsx";
import OrderDetails from "./Components/Orders/OrderDetail.jsx";
import Payment from "./Components/Orders/Payment.jsx";
import Checkout from "./Components/Orders/CheckOut.jsx";
import OrderSuccess from "./Components/Orders/OrderSucess.jsx";

export default function App() {
    const [products, setProducts] = useState(initialProducts);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const token = localStorage.getItem("token");
   
    return (
        <>
            <Toaster richColors position="top-right"/>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/about" element={<AboutSection />} />
                <Route path="/about" element={<AboutSection />} />
                <Route path="/admin/users/:id" element={<UserDetails />} />
                <Route path="/products" element={<Products products={products} />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path= "/orders" element = {<MyOrders/>} />
                <Route path= "/orders/:id" element = {<OrderDetails/>} />
                <Route path= "/payment" element = {<Payment/>} />
                <Route path= "/checkout/:productId" element = {<Checkout/>} />
                <Route path= "/order-success" element = {<OrderSuccess/>} />
                <Route path="/contact" element={<ContactForm />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        {/* <DashboardSelector /> */}
                        <DashboardPage/>
                    </ProtectedRoute>
                } />
            </Routes>
            <Footer />

        </>
    );
}

function DashboardSelector() {
    const { user } = useSelector(s => s.auth);
    if (user?.role === "farmer") return <FarmerDashboard />;
    if (user?.role === "retailer") return <BuyerDashboard />;
    //   if (user?.role === "admin") return <AdminDashboard />;
    return null;
}
