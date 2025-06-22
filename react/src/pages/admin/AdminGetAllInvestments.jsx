// src/pages/admin/AdminGetAllInvestments.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminGetAllInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axiosInstance.get("/investments/admin");
        setInvestments(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch investments");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Investments</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b">Investor</th>
              <th className="p-3 border-b">Venture</th>
              <th className="p-3 border-b">Amount</th>
              <th className="p-3 border-b">Expected Return</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  {inv.investedBy?.firstName} {inv.investedBy?.lastName}  <br />
                  <span className="text-xs text-gray-500">{inv.investedBy?.email}</span>
                </td>
                <td className="p-3 border-b">{inv.venture?.title}</td>
                <td className="p-3 border-b">€ {inv.amount.toLocaleString()}</td>
                <td className="p-3 border-b">€ {inv.totalExpectedReturn.toLocaleString()}</td>
                <td className="p-3 border-b">
                  {new Date(inv.investmentDate).toLocaleDateString()}
                </td>
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "invested"
                        ? "bg-blue-100 text-blue-800"
                        : inv.status === "completed"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
