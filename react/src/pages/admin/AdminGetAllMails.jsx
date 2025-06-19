import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminGetAllMails = () => {
  const [mails, setMails] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const fetchMails = async () => {
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const res = await axiosInstance.get("/admin/mails", { params });

      setMails(res.data.mails);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.pagination.totalPages,
      }));
    } catch (err) {
      console.error("Failed to fetch mails", err);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <h2>All Mails</h2>

      {/* Filters */}
      <div>
        <input
          type="text"
          name="search"
          placeholder="Search by subject..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Mails Table */}
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {mails.map((mail) => (
            <tr key={mail._id}>
              <td>{mail.name}</td>
              <td>{mail.email}</td>
              <td>{mail.subject}</td>
              <td>{mail.status}</td>
              <td>{new Date(mail.createdAt).toLocaleDateString()}</td>
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

export default AdminGetAllMails;
