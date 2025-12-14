import React from 'react';

export const TableShell = ({ title, children, count }) => (
  <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title} <span className="text-sm text-gray-500">({count})</span></h3>
    </div>
    {children}
  </div>
);