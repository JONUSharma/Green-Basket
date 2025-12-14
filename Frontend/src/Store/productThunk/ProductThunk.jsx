// productThunk/ProductThunk.jsx
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Axios/Instance";

// CREATE PRODUCT
export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            console.log(productData)
            const res = await instance.post("/product/create-product", productData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return res.data; // backend returns saved product
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Product creation failed.");
        }
    }
);

// GET ALL PRODUCTS (farmer)
export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await instance.get("/product/farmer-all-products");
            return res.data; // expected: { products: [...] }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load products.");
        }
    }
);
export const allApprovedProducts = createAsyncThunk(
    "product/approvedAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await instance.get("/product/approved");
            return res.data; // expected: { products: [...] }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load products.");
        }
    }
);

// DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await instance.delete(`/product/delete-product/${id}`);
            if(res.data)
            {
                toast.success("Product deleted successfully!");
            }
            return { id, ...res.data };

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Deletion failed.");
        }
    }
);

//update product
export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            console.log(id)
            const res = await instance.post(`/product/update-product/${id}`, productData);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Product update failed.");
        }
    }
)



