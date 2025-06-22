import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // use your axiosInstance

const AdminGetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: "",
  });

  const fetchUsers = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const res = await axiosInstance.get("/users", { params });

      setUsers(res.data.users || []);
      const { totalPages, total } = res.data.pagination || {};
      setPagination((prev) => ({
        ...prev,
        totalPages: totalPages || 1,
        total: total || 0,
      }));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search name or email..."
          value={filters.search}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <select
          name="isActive"
          value={filters.isActive}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="true">Active</option>
          <option value="false">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Joined</th>
              <th className="px-4 py-2 border">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="text-center">
                <td className="border px-4 py-2">
                  {(pagination.page - 1) * pagination.limit + i + 1}
                </td>
                <td className="border px-4 py-2">
                  {u.firstName} {u.lastName}
                </td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2 capitalize">{u.role}</td>
                <td className="border px-4 py-2">
                  {u.isActive ? "Active" : "Blocked"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {u.lastLoginAt
                    ? new Date(u.lastLoginAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: pageNum }))
              }
              className={`px-3 py-1 rounded border ${
                pagination.page === pageNum
                  ? "bg-gray-800 text-white"
                  : "bg-white"
              }`}
            >
              {pageNum}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AdminGetAllUsers;
