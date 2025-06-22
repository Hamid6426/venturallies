import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminGetVentureDetail() {
  const { ventureId } = useParams();
  const navigate = useNavigate();

  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ adminStatus: "", adminNotes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/ventures/id/${ventureId}`);
        const data = res.data.data; // ✅ fixed
        setVenture(data);
        setForm({
          adminStatus: data.adminStatus,
          adminNotes: data.adminNotes || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [ventureId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/ventures/admin/${ventureId}/admin-status-update`, form);
      const { data } = await axiosInstance.get(`/ventures/id/${ventureId}`);
      setVenture(data.data);
      alert("Updated successfully");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading…</div>;
  if (!venture) return <div>Not found.</div>;

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{venture.title}</h1>
      <p className="italic mb-4">
        Type: {venture.ventureType}, Status: {venture.lifecycleStatus}
      </p>

      {/* User Info */}
      {venture.createdBy && (
        <p className="mb-4 text-sm text-gray-600">
          Created by: {venture.createdBy.firstName} {venture.createdBy.lastName} (
          {venture.createdBy.email})
        </p>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold">Short Description</h2>
          <p>{venture.shortDescription}</p>
          <h2 className="font-semibold mt-4">Long Description</h2>
          <p>{venture.longDescription}</p>
          <h2 className="font-semibold mt-4">Collateral Description</h2>
          <p>{venture.collateralDescription}</p>
        </div>

        <div>
          <p>
            <strong>Target:</strong> €{venture.targetAmount}
          </p>
          <p>
            <strong>Funded:</strong> €{venture.amountFunded}
          </p>
          <p>
            <strong>Min Investment:</strong> €{venture.minInvestmentAmount}
          </p>
          <p>
            <strong>Max Investment:</strong> €{venture.maxInvestmentAmount}
          </p>
          <p>
            <strong>Expected Return:</strong> {venture.expectedReturn}%
          </p>
          <p>
            <strong>Investment Period:</strong> {venture.investmentPeriod} months
          </p>
          <p>
            <strong>Collateral Value:</strong> €{venture.collateralValue}
          </p>
          <p>
            <strong>Loan to Value:</strong> {venture.loanToValue}%
          </p>
          <p>
            <strong>Risk Level:</strong> {venture.riskLevel}
          </p>
          <p>
            <strong>Country:</strong> {venture.country}
          </p>
        </div>
      </div>

      {/* Images */}
      {venture.images?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Images</h2>
          <div className="flex flex-wrap gap-2">
            {venture.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`venture-${idx}`}
                className="w-32 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Admin Review */}
      <div className="max-w-md border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Admin Review</h2>
        <label className="block mb-2">
          Status:
          <select
            name="adminStatus"
            value={form.adminStatus}
            onChange={handleChange}
            className="ml-2 border px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label className="block mb-4">
          Notes:
          <textarea
            name="adminNotes"
            value={form.adminNotes}
            onChange={handleChange}
            rows={4}
            className="w-full border px-2 py-1 mt-1"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
