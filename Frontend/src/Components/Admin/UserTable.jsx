import { useNavigate } from "react-router-dom";

export const UserRow = ({ u }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/users/${u._id}`)}
      className="flex items-center justify-between p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
    >
      <div>
        <div className="font-medium">{u.name}</div>
        <div className="text-xs text-gray-500">{u.email}</div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`px-2 py-1 rounded text-sm ${
            u.active
              ? "bg-green-100 text-green-700"
              : "bg-green-200 text-green-700"
          }`}
        >
          {u.active ? "Active" : "active"}
        </div>
      </div>
    </div>
  );
};

export const UserTable = ({ users, onToggle }) => (
  <div className="space-y-1">
    {users.map(u => <UserRow key={u._id} u={u} onToggle={onToggle} />)}
  </div>
);