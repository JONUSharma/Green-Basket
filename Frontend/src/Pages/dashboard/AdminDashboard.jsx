import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdminData, approveProduct, updateProduct, removeProduct, toggleUser } from '../../Store/Admin/AdminSlice.jsx';
import { TableShell } from '../../Components/Admin/TableShell.jsx';
import { UserTable } from '../../Components/Admin/UserTable';
import { ProductTable } from '../../Components/Admin/ProductTable';
import { EditProductModal } from '../../Components/Admin//EditProductModal';
import { ConfirmDialog } from '../../Components/Admin//ConfirmDialog';
import { deleteProduct } from '../../Store/productThunk/ProductThunk.jsx';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { users, farmers, retailers, products, loading, error } = useSelector(s => s.admin);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, fn: null, title: '' });

  useEffect(() => { dispatch(loadAdminData()); }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveProduct(id));
  };

  const handleEdit = (p) => setEditing(p);
  const handleSave = async (data) => {
    if (!editing) return;
    await dispatch(updateProduct({ id: editing._id, data }));
    setEditing(null);
  };

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      title: 'Delete this product?',
      fn: async () => {
        await dispatch(removeProduct(id));
        setConfirm({ open: false, fn: null, title: '' });
      }
    });
  };

  const handleToggleUser = (user) => {
    setConfirm({ open: true, title: `Change status for ${user.name}?`, fn: async () => { await dispatch(toggleUser({ id: user._id, status: !user.active })); setConfirm({ open: false, fn: null, title: '' }); } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <TableShell title="Products" count={products.length}>
            <ProductTable products={products} farmer={farmers} onEdit={handleEdit} onDelete={handleDelete} onApprove={handleApprove} />
          </TableShell>

          <TableShell title="Farmers" count={farmers.length}>
            <UserTable users={farmers} onToggle={handleToggleUser} />
          </TableShell>

        </div>

        <div className="space-y-4">
          <TableShell title="Users" count={users.length}>
            <UserTable users={users} onToggle={handleToggleUser} />
          </TableShell>

          <TableShell title="Retailers" count={retailers.length}>
            <UserTable users={retailers} onToggle={handleToggleUser} />
          </TableShell>
        </div>
      </div>

      <EditProductModal product={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      <ConfirmDialog open={confirm.open} title={confirm.title} onCancel={() => setConfirm({ open: false, fn: null, title: '' })} onConfirm={async () => { if (confirm.fn) await confirm.fn(); }} />

      {loading && <div className="text-sm text-gray-500">Loading admin data...</div>}
      {error && <div className="text-sm text-red-600">{String(error)}</div>}
    </div>
  );
}