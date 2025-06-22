import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminAddBalance() {
  const { userId } = useParams();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({});

    try {
      const formData = new FormData();
      formData.append("amount", parseFloat(amount));
      formData.append("note", note);
      if (proofImage) {
        formData.append("proof", proofImage); // field name must match middleware
      }

      const res = await axiosInstance.post(
        `/balances/add-balance/${userId}`,
        formData
      );

      setMessage({ type: "success", text: res.data.message });
      setAmount("");
      setNote("");
      setProofImage(null);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Admin: Add Balance</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Amount (€)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Use a negative value to deduct from balance.
          </p>
        </div>

        <div>
          <label className="block font-medium mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={2}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Proof Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofImage(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
