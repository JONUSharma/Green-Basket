import React from "react";
import { Pencil, Trash2, CheckCircle2, Clock } from "lucide-react";

export const ProductTable = ({ products, onEdit, onDelete, onApprove }) => {
  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div
          key={p._id}
          className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row justify-between md:items-center gap-4">
            
            {/* Left Section */}
            <div className="flex gap-4 sm:flex-row">
              {/* Product Image */}
              <div className="w-28 h-28 flex-shrink-0">
                <img
                  src={p.image}
                  alt="product"
                  className="w-full h-full object-cover rounded-lg shadow-md "
                />
              </div>

              <div className="flex flex-col sm:flex-col justify-center">
                {/* Name */}
                <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {p.name}
                  {p.isApproved ? (
                    <span className="flex items-center text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      <CheckCircle2 size={12} className="mr-1" /> Approved
                    </span>
                  ) : (
                    <span className="flex items-center text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                      <Clock size={12} className="mr-1" /> Pending
                    </span>
                  )}
                </div>

                {/* Category + Price */}
                <div className="text-sm text-gray-600 mt-1">
                  <span className="capitalize">{p.category}</span> •{" "}
                  <span className="font-medium text-gray-800">
                    ₹{p.price} / {p.unit}
                  </span>
                </div>

                {/* Description */}
                <div className="text-sm text-gray-700 mt-2 line-clamp-3">
                  {p.description}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex gap-2 items-start md:items-center">
              {!p.isApproved && (
                <button
                  onClick={() => onApprove(p._id)}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow transition"
                >
                  Approve
                </button>
              )}

              <button
                onClick={() => onEdit(p)}
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 border border-blue-200 shadow-sm flex items-center gap-2 transition"
              >
                <Pencil size={16} /> Edit
              </button>

              <button
                onClick={() => onDelete(p._id)}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 border border-red-200 shadow-sm flex items-center gap-2 transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
