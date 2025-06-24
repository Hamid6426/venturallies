import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "repaid":
      return "bg-yellow-100 text-yellow-800";
    case "invested":
    default:
      return "bg-blue-100 text-blue-800";
  }
}

function Section({ title, children }) {
  return (
    <div className="my-8 w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-white shadow-md rounded-lg p-4">{children}</div>
    </div>
  );
}

export default function UserInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axiosInstance.get("/investments/my-investments");
        setInvestments(res.data);
      } catch (err) {
        console.error("Error fetching investments:", err);
        toast.error("Failed to load investments.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Section title="Your Investments">
        {loading ? (
          <div className="text-gray-600 text-sm">Loading investments...</div>
        ) : investments.length === 0 ? (
          <div className="text-gray-500 text-sm italic">
            You have no investments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Venture</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Profit Paid</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {inv.venture?.title || "Untitled Venture"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">€{inv.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-700">€{inv.profitPaid.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
