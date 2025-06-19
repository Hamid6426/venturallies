// src/pages/admin/AdminVentureDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminGetVentureDetail() {
  const { ventureId } = useParams();
  const navigate = useNavigate();

  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ adminStatus: "", adminNotes: "" });
  const [saving, setSaving] = useState(false);

  // Fetch detail
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/ventures/${ventureId}`);
        setVenture(res.data.venture);
        setForm({
          adminStatus: res.data.venture.adminStatus,
          adminNotes: res.data.venture.adminNotes || "",
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
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/admin/ventures/${ventureId}`, form);
      // refetch to get updated timestamps
      const { data } = await axiosInstance.get(`/ventures/${ventureId}`);
      setVenture(data.venture);
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
        Type: {venture.ventureType}, Status: {venture.status}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Descriptions */}
        <div>
          <h2 className="font-semibold">Short Description</h2>
          <p>{venture.shortDescription}</p>
          <h2 className="font-semibold mt-4">Long Description</h2>
          <p>{venture.longDescription}</p>
        </div>
        {/* Financials */}
        <div>
          <p>
            <strong>Target:</strong> {venture.targetAmount}
          </p>
          <p>
            <strong>Funded:</strong> {venture.amountFunded}
          </p>
          <p>
            <strong>Min Invest:</strong> {venture.minInvestmentAmount}
          </p>
          <p>
            <strong>Expected Return:</strong> {venture.expectedReturn}%
          </p>
          <p>
            <strong>Period:</strong> {venture.investmentPeriod} months
          </p>
        </div>
      </div>

      {/* Images */}
      {venture.images?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Images</h2>
          <div className="flex flex-wrap gap-2">
            {venture.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="w-32 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      {/* Admin Review Form */}
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
