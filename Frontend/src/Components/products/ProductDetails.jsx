import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import instance from "../../Axios/Instance";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await instance.get(`/product/single-product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);


  if (!product) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-green-700 mb-4 hover:underline"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl shadow-md w-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold text-green-900">{product.name}</h1>

          <p className="text-2xl font-semibold text-green-700 mt-2">
            ₹{product.price} / {product.unit}
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.category}
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Farmer Info */}
          <div className="mt-6 bg-green-50 p-4 rounded-xl">
            <h2 className="text-lg font-semibold text-green-800">Farmer Info</h2>
            <p className="text-gray-700 mt-2">
              <strong>Name:</strong> {product.farmer?.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {product.farmer?.email}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {product.farmer?.phone}
            </p>
          </div>

          {/* Buy Button */}
          <button
            onClick={()=> navigate(`/checkout/${product._id}`)}
            className="mt-6 w-full flex justify-center items-center bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
          >
            <ShoppingBag size={20} className="mr-2" />
            Buy Now
          </button>
        </div>
      </div>
     

    </div>
  );
};

export default ProductDetails;
