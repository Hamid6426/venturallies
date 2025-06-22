import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function UserVentures() {
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const res = await axiosInstance.get("/ventures/my-ventures");
        setVentures(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load ventures");
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-semibold mb-6">My Ventures</h1>
        <Link
          to="/dashboard/create-venture"
          className="py-4 px-8 bg-green-500 text-white hover:-translate-y-1"
        >
          Create Venture
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && ventures.length === 0 && (
        <p className="text-gray-500">You haven't created any ventures yet.</p>
      )}

      {!loading && ventures.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow mt-8">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-green-200 text-sm uppercase">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Funding</th>
                <th className="p-3">Return (%)</th>
                <th className="p-3">Risk</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y bg-green-50 divide-gray-200">
              {ventures.map((v) => (
                <tr key={v._id}>
                  <td className="p-3 font-medium">
                    <Link
                      to={`/account/my-ventures/${v._id}`}
                      className="hover:text-green-500"
                    >
                      {v.title}
                    </Link>
                  </td>
                  <td className="p-3 capitalize">{v.ventureType}</td>
                  <td className="p-3 capitalize">
                    <span className="text-xs text-gray-500">
                      {v.adminStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    {(v.amountFunded || 0).toLocaleString()} /{" "}
                    {v.targetAmount?.toLocaleString()} PKR
                  </td>
                  <td className="p-3">{v.expectedReturn}%</td>
                  <td className="p-3 capitalize">{v.riskLevel}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
