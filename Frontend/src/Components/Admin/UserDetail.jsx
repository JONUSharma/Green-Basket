import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../Axios/Instance";
import { toast } from "sonner";
import { ArrowLeft, Trash2, ShieldCheck, ShieldX } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState({ open: false, fn: null, title: "" });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await instance.get(`/admin/user/${id}`);
            setUser(res.data.user);
        } catch (err) {
            toast.error("Failed to fetch user");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            if(user?.role === "admin")
            {
                toast.error("Admin cannot be deleted");
                return;
            }

            setConfirm({
                open: true,
                title: "Delete this user?",
                fn: async () => {
                    await instance.delete(`/admin/users/${id}`);
                    setConfirm({ open: false, fn: null, title: '' });
                    toast.success("User deleted successfully");
                    navigate(-1);
                }
            })
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    if (loading)
        return (
            <div className="max-w-3xl mx-auto p-6 animate-pulse">
                <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                </div>
            </div>
        );

    if (!user) return <p className="text-center mt-10">User not found</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg border hover:bg-gray-100"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-2xl font-semibold">User Details</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">

                {/* Name & Status */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="flex gap-2">
                        <span
                            className={`px-3 py-1 text-sm rounded-full font-medium ${user.isVerified
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.isVerified ? (
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={14} /> Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <ShieldX size={14} /> Not Verified
                                </span>
                            )}
                        </span>

                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium capitalize">
                            {user.role}
                        </span>
                    </div>
                </div>

                <hr />

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Phone Number</p>
                        <p className="font-medium">{user.phone || "—"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Account Created</p>
                        <p className="font-medium">
                            {new Date(user.createdAt).toDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-red-700 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                    Deleting this user is permanent and cannot be undone.
                </p>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                    <Trash2 size={16} />
                    Delete User
                </button>
            </div>
            <ConfirmDialog open={confirm.open} title={confirm.title} onCancel={() => setConfirm({ open: false, fn: null, title: '' })} onConfirm={confirm.fn}></ConfirmDialog>
        </div>
    );
};

export default UserDetails;
