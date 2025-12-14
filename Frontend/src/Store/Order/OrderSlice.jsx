import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Axios/Instance";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const data = await instance.get("/order/my-orders");
            return data.data.orders;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error loading orders");
        }
    }
);

export const cancelOrder = createAsyncThunk(
    "orders/cancelOrder",
    async (id, { rejectWithValue }) => {
        try {
            console.log(id)
            await instance.put(`/order/cancel/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error cancelling");
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Cancel order
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.orders = state.orders.map((o) =>
                    o._id === action.payload ? { ...o, status: "cancelled" } : o
                );
            });
    },
});

export default orderSlice.reducer;
