import React, { useState, useEffect } from 'react';

export const EditProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({ name: '', price: '', unit: 'kg', description: '', category: 'vegetables' });

  useEffect(() => {
    if (product) setForm({ name: product.name || '', price: product.price || '', unit: product.unit || 'kg', description: product.description || '', category: product.category || 'vegetables' });
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
        <div className="space-y-3">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="p-2 border rounded" />
            <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="p-2 border rounded">
              <option value="kg">kg</option>
              <option value="unit">unit</option>
              <option value="quintal">quintal</option>
            </select>
          </div>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full p-2 border rounded" rows={3} />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
          <button onClick={()=>onSave(form)} className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
        </div>
      </div>
    </div>
  );
};