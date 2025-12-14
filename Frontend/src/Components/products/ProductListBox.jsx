import React, { useState } from "react";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Trash2,
  Pencil,
} from "lucide-react";

const ProductListBox = ({
  farmersProducts,
  loading,
  error,
  onDelete,
  onEdit,
}) => {
  const [open, setOpen] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Track which product is expanded

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-green-300 p-6 mt-6 transition-all">

      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-2xl font-bold text-green-700 flex items-center">
          <Package className="mr-2" /> My Listings ({farmersProducts.length})
        </h2>

        {open ? (
          <ChevronUp className="text-green-700" />
        ) : (
          <ChevronDown className="text-green-700" />
        )}
      </div>

      {/* Collapsible Main Box */}
      {open && (
        <div className="mt-4 transition-all">
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : error ? (
            <p className="text-center text-red-600">Failed to load products</p>
          ) : farmersProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-3">No listings yet</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin pr-2">

              {farmersProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-green-50 border border-green-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Summary Row (clickable) */}
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-green-100 transition-all"
                    onClick={() => toggleExpand(p._id)}
                  >
                    <div>
                      <p className="font-semibold text-green-800 text-lg">
                        {p.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{p.price} / {p.unit}
                      </p>
                    </div>

                    {expandedId === p._id ? (
                      <ChevronUp className="text-green-700" />
                    ) : (
                      <ChevronDown className="text-green-700" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  <div
                    className={`transition-all duration-300 bg-white px-4 overflow-hidden ${
                      expandedId === p._id
                        ? "max-h-[500px] py-4"
                        : "max-h-0 py-0"
                    }`}
                  >
                    <p className="text-gray-800 text-sm mb-2">
                      <span className="font-semibold text-green-700">Category:</span>{" "}
                      {p.category}
                    </p>

                    <p className="text-gray-700 text-sm mb-2">
                      <span className="font-semibold text-green-700">Description:</span>{" "}
                      {p.description || "No description provided"}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4">
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(p)}
                        className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Pencil size={16} /> Edit
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(p._id)}
                        className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-medium flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>


                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListBox;
