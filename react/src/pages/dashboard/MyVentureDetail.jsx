import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function MyVentureDetail() {
  const { ventureId } = useParams();
  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenture = async () => {
      try {

        const res = await axiosInstance.get(`/api/ventures/id/${ventureId}`, {
          withCredentials: true,
        });
        setVenture(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch venture details.");
      } finally {
        setLoading(false);
      }
    };

    if (ventureId) fetchVenture();
  }, [ventureId]);

  if (loading) return <p className="p-6">Loading venture...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!venture) return <p className="p-6">No venture found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{venture.title}</h1>

      <div className="space-y-2">
        <p><strong>Status:</strong> {venture.status}</p>
        <p><strong>Type:</strong> {venture.ventureType}</p>
        <p><strong>Country:</strong> {venture.country || "N/A"}</p>
        <p><strong>Target Amount:</strong> {venture.targetAmount?.toLocaleString()} PKR</p>
        <p><strong>Amount Funded:</strong> {venture.amountFunded?.toLocaleString()} PKR</p>
        <p><strong>Expected Return:</strong> {venture.expectedReturn}%</p>
        <p><strong>Investment Period:</strong> {venture.investmentPeriod} months</p>
        <p><strong>Closing Date:</strong> {new Date(venture.closingDate).toLocaleDateString()}</p>
        <p><strong>Created At:</strong> {new Date(venture.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="mt-2 text-gray-700">{venture.longDescription}</p>
      </div>
    </div>
  );
}
