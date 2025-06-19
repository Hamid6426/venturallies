import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminGetAllVentures() {
  const [ventures, setVentures] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    lifecycleStatus: "",
    ventureType: "",
    adminStatus: "",
    visibility: "",
    riskLevel: "",
    country: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Fetch from API
  const fetchVentures = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const res = await axiosInstance.get("/ventures", { params });

      setVentures(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error("Failed to fetch ventures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentures();
    // eslint-disable-next-line
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Ventures</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search by title…"
          value={filters.search}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded flex-1 min-w-[200px]"
        />
        <select
          name="lifecycleStatus"
          value={filters.lifecycleStatus}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="coming-soon">Coming Soon</option>
          <option value="funded">Funded</option>
          <option value="repaid">Repaid</option>
        </select>
        <select
          name="ventureType"
          value={filters.ventureType}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Types</option>
          <option value="business">Business</option>
          <option value="sme">SME</option>
          <option value="leasing">Leasing</option>
          <option value="realestate">Real Estate</option>
        </select>
        <select
          name="adminStatus"
          value={filters.adminStatus}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Admin Review</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          name="visibility"
          value={filters.visibility}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="draft">Draft</option>
        </select>
        <select
          name="riskLevel"
          value={filters.riskLevel}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Risk Level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          name="country"
          value={filters.country}
          onChange={handleFilterChange}
          placeholder="Country"
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Visibility</th>
              <th className="p-2 border">Admin Status</th>
              <th className="p-2 border">Issued</th>
              <th className="p-2 border">Closing</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  Loading…
                </td>
              </tr>
            ) : ventures.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No ventures found.
                </td>
              </tr>
            ) : (
              ventures.map((v, i) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">
                    {(pagination.page - 1) * pagination.limit + i + 1}
                  </td>
                  <td className="p-2 border">{v.title}</td>
                  <td className="p-2 border capitalize">{v.ventureType}</td>
                  <td className="p-2 border capitalize">{v.lifecycleStatus}</td>
                  <td className="p-2 border capitalize">{v.visibility}</td>
                  <td className="p-2 border capitalize">{v.adminStatus}</td>
                  <td className="p-2 border">
                    {v.dateIssued
                      ? new Date(v.dateIssued).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2 border">
                    {new Date(v.closingDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border space-x-1 text-center">
                    <Link
                      to={`/admin/ventures/${v._id}`}
                      className="px-2 py-1 rounded border hover:bg-gray-100 text-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map(
          (pg) => (
            <button
              key={pg}
              onClick={() => setPagination((p) => ({ ...p, page: pg }))}
              className={`px-3 py-1 rounded border ${
                pagination.page === pg ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {pg}
            </button>
          )
        )}
      </div>
    </div>
  );
}
