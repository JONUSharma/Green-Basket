import React, { useEffect, useState } from 'react';
import ProductCard from '../Components/products/ProductsCard.jsx';
import { initialProducts } from '../data/mockData.js'
import { useDispatch, useSelector } from 'react-redux';
import { allApprovedProducts } from '../Store/productThunk/ProductThunk.jsx';
const ProductsPage = ({ }) => {
    // const [products, setProducts] = useState(initialProducts);
    const { products, isLoading } = useSelector((state) => state.product)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allApprovedProducts())
    }, [dispatch])
    return (
        <section id="products-list" className="py-16 bg-white">
            <h2 className="text-4xl font-extrabold text-center mb-12 text-green-800">
                🌱 Freshly Harvested Produce
            </h2>

            {
                isLoading && (
                    <div className="w-full flex flex-col items-center justify-center py-6 gap-3 animate-pulse">
                        <div className="flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-xl text-green-600 font-semibold">Loading products...</p>
                        <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
                    </div>
                )
            }
            {!isLoading && products?.length === 0 && (
                <p className="text-center text-gray-500 text-lg">No products found.</p>
            )}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                ))}
            </div>
        </section>
    );
};

export default ProductsPage;