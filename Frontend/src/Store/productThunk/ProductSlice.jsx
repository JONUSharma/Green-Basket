import { createSlice } from "@reduxjs/toolkit";
import { createProduct, deleteProduct, updateProduct, getAllProducts, allApprovedProducts } from "./ProductThunk";

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        isLoading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle createProduct
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products.push(action.payload.product);
                console.log(action.payload.product)
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // update product
            .addCase(updateProduct.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const newProduct = action.payload.updatedProduct;
                state.products = state.products.map(p => p._id === newProduct._id ? newProduct : p);
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            //handle delete
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = state.products.filter((product) => product._id !== action.payload.id);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // farmer get all products
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.products;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //  get all products
            .addCase(allApprovedProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(allApprovedProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(allApprovedProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
