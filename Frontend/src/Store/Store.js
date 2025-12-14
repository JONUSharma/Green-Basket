import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./UserThunk/AuthSlice.jsx";
import productSlice from "./productThunk/ProductSlice.jsx"
import adminReducer from "./Admin/AdminSlice.jsx"
import  orderSlice from "./Order/OrderSlice.jsx"
export const store = configureStore({
reducer : {
    auth : authSlice,
    product : productSlice,
    admin : adminReducer,
    orders : orderSlice
}
})
