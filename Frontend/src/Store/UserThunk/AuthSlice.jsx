import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../Axios/Instance"
import { toast } from "sonner";

// --- Async Thunks ---

// 1. SIGNUP THUNK
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            console.log(userData)
            // backend requires name, email, password, confirmPassword, role, phone
            const response = await instance.post("/user/signup", userData);
            console.log(response.data)
            toast.success("Signup successful! Please verify your email.");
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message || "Signup failed.");
            return rejectWithValue(error.response.data.message || "Signup failed.");
        }
    }
);

// 2. VERIFY EMAIL THUNK
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            // Backend endpoint: POST /verify-email
            const response = await instance.post("/user/verify-email", { email, otp });
            toast.success("Email verified successfully!");
            return response.data; // Should contain user data and set cookie
        } catch (error) {
            toast.error(error.response.data.message || "OTP verification failed.");
            return rejectWithValue(error.response.data.message || "OTP verification failed.");
        }
    }
);

// 3. LOGIN THUNK
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password, phone }, { rejectWithValue }) => {
        try {
            const loginData = { email, password };
            const response = await instance.post("/user/login", loginData);
            toast.success("Login successful!");
            return response.data;

        } catch (error) {
            toast.error(error.response.data.message || "Login failed.");
            return rejectWithValue(error.response.data.message || "Login failed.");
        }
    }
);


// --- Slice Definition ---
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: storedUser ? JSON.parse(storedUser) : null, // Stores user data after login/verification
        isAuthenticated: storedToken ? true : false,
        token: storedToken || null,
        isLoading: false,
        error: null,
        // State for the verification flow
        isOtpSent: false, // True after successful signup
        tempEmail: null,  // Holds email until verification is complete
    },

    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isOtpSent = false;
            state.tempEmail = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle Register
            .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tempEmail = action.payload.user.email; // Store email for verification
                state.error = null;
                state.isOtpSent = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Handle OTP Verification
            .addCase(verifyOtp.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user; // User is verified and logged in
                state.isOtpSent = false;
                state.tempEmail = null;
                state.error = null;
                state.token = action.payload.token

                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Handle Login
            .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token
                state.error = null;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});



export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;