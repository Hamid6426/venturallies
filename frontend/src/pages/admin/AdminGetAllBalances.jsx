// src/pages/Admin/AdminGetAllBalances.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

export default function AdminGetAllBalances() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/balances", {
        params: { search, page, limit, sortBy, sortOrder },
      });
      setBalances(res.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching balances:", err);
      setError("Failed to load balances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [search, page, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All User Balances</h1>

      {/* Search and Sort Controls */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearchChange}
          className="border px-4 py-2 rounded w-full sm:w-64"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="updatedAt">Sort by Updated</option>
          <option value="balance">Sort by Balance</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading balances...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : balances.length === 0 ? (
        <p className="text-gray-500">No balances found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-right p-3">Balance (€)</th>
                <th className="text-right p-3">Created At</th>
                <th className="text-right p-3">Last Updated</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">
                    {b.user?.firstName} {b.user?.lastName}
                  </td>
                  <td className="p-3">{b.user?.email}</td>
                  <td className="p-3 capitalize">{b.user?.role || "N/A"}</td>
                  <td className="p-3 text-right">
                    €{" "}
                    {typeof b.balance === "number" ? b.balance.toFixed(2) : "—"}
                  </td>

                  <td className="p-3 text-right">
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 text-right">
                    {b.updatedAt
                      ? new Date(b.updatedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/balances/add-balance/${b.user?._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Add Balance
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
