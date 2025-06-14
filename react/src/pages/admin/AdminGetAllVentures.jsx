import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminGetAllVentures = () => {
  const [ventures, setVentures] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    status: "",
    ventureType: "",
    adminStatus: "",
    visibility: "",
    search: "",
  });

  const fetchVentures = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const res = await axios.get("/api/admin/ventures", { params });

      setVentures(res.data.ventures);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.pagination.totalPages,
      }));
    } catch (err) {
      console.error("Failed to fetch ventures", err);
    }
  };

  useEffect(() => {
    fetchVentures();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <h2>All Ventures</h2>

      {/* 🔍 Filters */}
      <div>
        <input
          type="text"
          name="search"
          placeholder="Search title..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
        <select name="ventureType" value={filters.ventureType} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="tech">Tech</option>
          <option value="non-tech">Non-Tech</option>
        </select>
        {/* Add more filters similarly */}
      </div>

      {/* 📋 Venture List */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Type</th>
            <th>Visibility</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {ventures.map((venture) => (
            <tr key={venture._id}>
              <td>{venture.title}</td>
              <td>{venture.status}</td>
              <td>{venture.ventureType}</td>
              <td>{venture.visibility}</td>
              <td>{new Date(venture.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📃 Pagination */}
      <div>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            disabled={num === pagination.page}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminGetAllVentures;
