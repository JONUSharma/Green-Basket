// src/pages/FarmerDashboard.jsx
import React, { useState, useEffect } from "react";
import { CloudUpload, Package, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../../Store/productThunk/ProductThunk.jsx";
import { generateDescription } from "../../api/geminiUitility.js";
import ProductListBox from "../../Components/products/ProductListBox.jsx";
import { ConfirmDialog } from "../../Components/Admin/ConfirmDialog.jsx";

const FarmerDashboard = ({ onProductUpload }) => {
  const dispatch = useDispatch();

  // Extract correct values from reducer
  const { products, loading, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth)
  const [confirm, setConfirm] = useState({ open: false, fn: null, title: '' });

  // Debug
  const productList = products || [];

  // Local form state
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "kg",
    description: "",
    category: "vegetables",
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
  };


  const [loadingState, setLoadingState] = useState({
    generate: false,
    upload: false
  });

  // Fetch products only once
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Filter farmer’s own products
  const farmersProducts = productList.filter((p) => {
    const farmerId = typeof p.farmer === "string" ? p.farmer : p.farmer?._id;
    return farmerId === user?._id;
  });


  // ---------------- Form Change Handler ------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- AI Description Generator ------------------
const handleGenerateDescription = async () => {
    // 1. Validation: Ensure we have enough info to write a good description
    if (!form.name || !form.price) {
      return toast.error("Please enter a Crop Name and Price first.");
    }
  
    try {
      setLoadingState((s) => ({ ...s, generate: true }));
  
      // 2. Prepare the data for the API
      // We combine price, unit, and any existing details into a string context
      const detailsContext = `Price: ${form.price} per ${form.unit}. Type: Agricultural Produce.`;
  
      // 3. Call the API function
      // NOTE: We pass the Name and the Details. The 'Marketing Persona' is handled inside geminiService.js
      const generatedText = await generateDescription(form.name, detailsContext);
  
      // 4. Update the form state with the result
      setForm((prev) => ({ ...prev, description: generatedText }));
  
      toast.success("Description generated successfully!");
      
    } catch (err) {
      console.error("Generation Error:", err);
      toast.error("Failed to generate description.");
    } finally {
      setLoadingState((s) => ({ ...s, generate: false }));
    }
  };

  //---------- delete product
  const handleDelete = async (id) => {
    setConfirm({ open: true, title: 'Delete this product?', fn: async () => { await dispatch(deleteProduct(id)); setConfirm({ open: false, fn: null, title: '' }); } });
  };

  // ---------------- Upload Handler ------------------
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      return toast.error("Enter crop name & price first");
    }

    // ---- CREATE FORMDATA ----
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("unit", form.unit);
    fd.append("description", form.description);
    fd.append("category", form.category);

    if (form.image) {
      fd.append("image", form.image);
    }

    if (editProduct) {
      await dispatch(updateProduct({ id: editProduct._id, productData: fd }));
    } else {
      await dispatch(createProduct(fd));
      toast.success("Product added!");
    }

    // Reset form
    setForm({
      name: "",
      price: "",
      unit: "kg",
      description: "",
      category: "vegetables",
      image: null,
    });
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-2">

      {/* ------------ Upload Card -------------- */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-green-300 p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
          <CloudUpload className="mr-2" /> Upload New Crop
        </h2>

        <form onSubmit={handleUpload} className="space-y-5">
          <InputField
            label="Crop Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Organic Tomatoes"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Price (₹)"
              name="price"
              placeholder="e.g. 100"
              type="number"
              min="1"
              value={form.price}
              onChange={handleChange}
              required
            />
            <SelectField
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            />
          </div>

          <div className="w-md">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-3 bg-white focus:ring-green-500 focus:border-green-500"
            >
              <option value="vegetables">vegetables</option>
              <option value="fruits">fruits</option>
              <option value="dairy">dairy</option>
            </select>
          </div>

          <div className="w-md">
            <label className="text-sm font-medium text-gray-700">Product Image *</label>

            <label
              className="mt-1 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed 
    border-green-400 rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition"
            >
              {form.image ? (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <CloudUpload className="w-10 h-10 text-green-600" />
                  <p className="text-sm text-green-700 font-semibold">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG (max 5MB)
                  </p>
                </div>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>


          <textarea
            rows="3"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            className="w-full border rounded-md p-3 focus:ring-green-500 focus:border-green-500"
          />

          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={loadingState.generate}
            className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loadingState.generate ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              "✨ AI Generate"
            )}
          </button>

          {/* --- Upload / Update Button --- */}
          <button
            type="submit"
            disabled={!form.name || !form.price || loadingState.upload}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center justify-center"
          >
            {loadingState.upload ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <CloudUpload className="mr-2" />
                {editProduct ? "Update Product" : "Upload Harvest"}
              </>
            )}
          </button>

          {/* --- Cancel Editing Button (Only visible in edit mode) --- */}
          {editProduct && (
            <button
              type="button"
              onClick={() => {
                setEditProduct(null);
                setForm({
                  name: "",
                  price: "",
                  unit: "kg",
                  description: "",
                  category: "vegetables",
                });
              }}
              className="mt-2 w-full py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel Editing
            </button>
          )}

        </form>
        {/* confirm dialog */}
        <ConfirmDialog open={confirm.open} title={confirm.title} onCancel={() => setConfirm({ open: false, fn: null, title: '' })} onConfirm={confirm.fn}></ConfirmDialog>

      </div>

      {/* ------------ Product Listings ---------- */}
      {/* <div className="bg-white rounded-xl shadow-lg border border-green-300 p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
          <Package className="mr-2" /> My Listings ({farmersProducts.length})
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-600">Failed to load products</p>
        ) : farmersProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-3">No listings yet</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
            {farmersProducts.map((p) => (
              <div
                key={p._id}
                className="p-3 bg-green-50 border border-green-100 rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold text-green-800">{p.name}</p>
                  <p className="text-sm text-gray-500">₹{p.price} / {p.unit}</p>
                </div>
                <button onClick={()=> handleDelete(p._id)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div> */}
      <ProductListBox
        farmersProducts={farmersProducts}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onEdit={(p) => {
          setEditProduct(p);
          setForm({
            name: p.name,
            price: p.price,
            unit: p.unit,
            description: p.description,
            category: p.category
          });

          window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
        }}
      />

    </div>
  );
};

// ---------------- Reusable UI ------------------
const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-1 w-full border rounded-md p-3 focus:ring-green-500 focus:border-green-500"
    />
  </div>
);

const SelectField = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-1 w-full border rounded-md p-3 bg-white focus:ring-green-500 focus:border-green-500"
    >
      <option value="kg">Kilogram (kg)</option>
      <option value="unit">Unit/Piece</option>
      <option value="quintal">Quintal</option>
    </select>
  </div>
);



export default FarmerDashboard;
