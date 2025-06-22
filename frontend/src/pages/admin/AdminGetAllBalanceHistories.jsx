import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; // admin auth attached
import formatDate from "../../utils/formatDate"; // you might already have this

export default function AdminGetAllBalanceHistories() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const res = await axiosInstance.get("/balances/all-histories"); // hypothetical endpoint
        setHistories(res.data);
      } catch (err) {
        console.error("Failed to fetch histories", err);
        setError("Could not load balance history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Balance Histories</h1>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Before</th>
              <th className="p-3">After</th>
              <th className="p-3">Note</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((h) => (
              <tr key={h._id} className="border-t">
                <td className="p-3">
                  {h.user?.firstName} {h.user?.lastName}
                </td>
                <td className="p-3">{h.user?.email}</td>
                <td className="p-3 text-green-600 font-medium">
                  € {h.amount.toFixed(2)}
                </td>
                <td className="p-3">€ {h.balanceBefore.toFixed(2)}</td>
                <td className="p-3">€ {h.balanceAfter.toFixed(2)}</td>
                <td className="p-3">{h.note || "—"}</td>
                <td className="p-3">{formatDate(h.history?.[0]?.at)}</td>
                <td className="p-3">
                  {/* Optional modal or expandable row for full history */}
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
