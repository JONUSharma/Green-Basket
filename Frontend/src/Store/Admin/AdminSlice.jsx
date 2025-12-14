import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../Axios/AdminAxios';

export const loadAdminData = createAsyncThunk('admin/load', async (_, { rejectWithValue }) => {
  try {
    const [users, farmers, retailers, products] = await Promise.all([
      adminApi.fetchUsers(),
      adminApi.fetchFarmers(),
      adminApi.fetchRetailers(),
      adminApi.fetchProducts(),
      // adminApi.fetchSingleUser(),
    ]);
    return { users, farmers, retailers, products };
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// export const getSingleUser = createAsyncThunk('admin/getSingleUser', async (id, { rejectWithValue }) => {
//   try {
//     const res = await adminApi.fetchSingleUser(id);
//     return res;
//   } catch (err) {
//     return rejectWithValue(err.response?.data || err.message);
//   }
// })

export const approveProduct = createAsyncThunk('admin/approveProduct', async (id, { rejectWithValue }) => {
  try {
    const res = await adminApi.approveProduct(id);
    return res;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await adminApi.updateProduct(id, data);
    return res;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const removeProduct = createAsyncThunk('admin/removeProduct', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteProduct(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const toggleUser = createAsyncThunk('admin/toggleUser', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await adminApi.toggleUserStatus(id, status);
    return res;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    user: [],
    farmers: [],
    retailers: [],
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminData.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loadAdminData.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload.users;
        s.farmers = a.payload.farmers;
        s.retailers = a.payload.retailers;
        s.products = a.payload.products;
      })
      .addCase(loadAdminData.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(approveProduct.fulfilled, (s, a) => {
        const updated = a.payload;
        s.products = s.products.map(p => p._id === updated._id ? updated : p);
      })
      .addCase(updateProduct.fulfilled, (s, a) => {
        const updated = a.payload;
        s.products = s.products.map(p => p._1d === updated._id ? updated : p);
      })
      .addCase(removeProduct.fulfilled, (s, a) => {
        s.products = s.products.filter(p => p._id !== a.payload);
      })
      .addCase(toggleUser.fulfilled, (s, a) => {
        const changed = a.payload;
        s.users = s.users.map(u => u._id === changed._id ? changed : u);
      })
      // .addCase(getSingleUser.fulfilled, (s, a) => {
      //   s.user = a.payload;
      // })
  }
});

export default adminSlice.reducer;