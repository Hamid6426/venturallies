import React, { useEffect, useState } from "react";
import axios from "axios";

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

      const res = await axios.get("/api/admin/users", { params });

      setUsers(res.data.users);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.pagination.totalPages,
      }));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <h2>All Users</h2>

      {/* Filters */}
      <div>
        <input
          type="text"
          name="search"
          placeholder="Search name or email..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* User Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPagination((prev) => ({ ...prev, page: num }))}
            disabled={num === pagination.page}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminGetAllUsers;
