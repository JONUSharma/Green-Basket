import axios from 'axios';

const instance = axios.create({
  baseURL: "https://green-basket-backend-wji4.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true
  }
})
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const adminApi = {
  // USERS
  fetchUsers: () => instance.get('/admin/users').then(r => {  return r.data }),
  toggleUserStatus: (id, status) => instance.patch(`/admin/users/${id}/status`, { status }).then(r => r.data),
  // fetchSingleUser: (id) => instance.get(`/admin/user/${id}`).then(r => r.data),

  // FARMERS / RETAILERS
  fetchFarmers: () => instance.get('/admin/farmers').then(r => r.data),
  fetchRetailers: () => instance.get('/admin/retailers').then(r => r.data),
  changeRole: (id, role) => instance.patch(`/admin/users/${id}/role`, { role }).then(r => r.data),

  // PRODUCTS
  fetchProducts: () => instance.get('/admin/products').then(r => r.data),
  approveProduct: (id) => instance.put(`/admin/product-approve/${id}`).then(r => r.data),
  updateProduct: (id, data) => instance.put(`/admin/product-update/${id}`, data).then(r => r.data),
  deleteProduct: (id) => instance.delete(`/admin/product-reject/${id}`).then(r => r.data),
};
export default adminApi;