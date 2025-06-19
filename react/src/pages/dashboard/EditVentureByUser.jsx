// src/pages/EditVentureByUser.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function EditVentureByUser() {
  const { ventureId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    collateralDescription: "",
    country: "",
    ventureType: "",
    riskLevel: "medium",
    minInvestmentAmount: "",
    maxInvestmentAmount: "",
    targetAmount: "",
    expectedReturn: "",
    investmentPeriod: "",
    closingDate: "",
    tags: [],
    // …add any other user-editable fields
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1️⃣ Fetch existing venture
  useEffect(() => {
    const fetchVenture = async () => {
      try {
        const { data } = await axiosInstance.get(`/ventures/id/${ventureId}`);
        // Pre-fill form with response
        setFormData({
          title: data.title || "",
          shortDescription: data.shortDescription || "",
          longDescription: data.longDescription || "",
          collateralDescription: data.collateralDescription || "",
          country: data.country || "",
          ventureType: data.ventureType || "",
          riskLevel: data.riskLevel || "medium",
          minInvestmentAmount: data.minInvestmentAmount || "",
          maxInvestmentAmount: data.maxInvestmentAmount || "",
          targetAmount: data.targetAmount || "",
          expectedReturn: data.expectedReturn || "",
          investmentPeriod: data.investmentPeriod || "",
          closingDate: data.closingDate?.split("T")[0] || "",
          tags: data.tags || [],
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load venture details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenture();
  }, [ventureId]);

  // 2️⃣ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // 3️⃣ Handle tags (comma-separated)
  const handleTagsChange = (e) => {
    setFormData((f) => ({
      ...f,
      tags: e.target.value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    }));
  };

  // 4️⃣ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Strip forbidden fields
    const forbidden = [
      "_id",
      "createdBy",
      "createdAt",
      "updatedAt",
      "slug",
      "amountFunded",
      "isDeleted",
      "adminStatus",
      "adminReviewedAt",
      "adminNotes",
      "schedules",
      "principal",
      "interest",
      "total",
      "goesLiveAt",
      "launchDate",
      "visibility",
      "isFeatured",
      "featuredUntil",
    ];
    const payload = { ...formData };
    forbidden.forEach((f) => delete payload[f]);

    try {
      await axiosInstance.patch(`/ventures/id/${ventureId}`, payload);
      // On success, redirect back to detail
      navigate(`/account/my-ventures/${ventureId}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // 5️⃣ Render
  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;

  return (
    <div className="mx-auto">
      <h2 className="text-4xl font-semibold mb-6 text-center py-20 bg-gray-100">
        Edit Venture
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-12 text-lg md:text-xl max-w-3xl mx-auto py-24 px-4"
      >
        {/* SECTION: General Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">General Info</h4>
          <div className="w-full space-y-4">
            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <textarea
              name="shortDescription"
              placeholder="Short Description"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <textarea
              name="longDescription"
              placeholder="Long Description"
              value={formData.longDescription}
              onChange={handleChange}
              rows={4}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
          </div>
        </section>

        {/* SECTION: Collateral & Type */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">
            Venture Details
          </h4>
          <div className="w-full space-y-4">
            <textarea
              name="collateralDescription"
              placeholder="Collateral Details"
              value={formData.collateralDescription}
              onChange={handleChange}
              rows={2}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-red-300 focus:border-red-500 focus:outline-2"
            />
            <select
              name="ventureType"
              value={formData.ventureType}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full bg-transparent"
            >
              <option value="">Select type</option>
              <option value="business">Business</option>
              <option value="sme">SME</option>
              <option value="leasing">Leasing</option>
              <option value="realestate">Real Estate</option>
            </select>
            <select
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full bg-transparent"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </section>

        {/* SECTION: Financial Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Financials</h4>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              name="minInvestmentAmount"
              placeholder="Min Investment (PKR)"
              value={formData.minInvestmentAmount}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
            <input
              type="number"
              name="maxInvestmentAmount"
              placeholder="Max Investment (PKR)"
              value={formData.maxInvestmentAmount}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
            <input
              type="number"
              name="targetAmount"
              placeholder="Target Amount (PKR)"
              value={formData.targetAmount}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
            <input
              type="number"
              name="expectedReturn"
              placeholder="Expected Return (%)"
              value={formData.expectedReturn}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
            <input
              type="number"
              name="investmentPeriod"
              placeholder="Period (months)"
              value={formData.investmentPeriod}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
            <input
              type="date"
              name="closingDate"
              value={formData.closingDate}
              onChange={handleChange}
              required
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
          </div>
        </section>

        {/* SECTION: Tags */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Tags</h4>
          <div className="w-full">
            <input
              name="tags"
              placeholder="Enter comma-separated tags"
              value={formData.tags.join(", ")}
              onChange={handleTagsChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full"
            />
          </div>
        </section>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 mt-12">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1 transition"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <Link
            to={`/account/my-ventures/${ventureId}`}
            className="bg-gray-800 text-white px-12 py-4 rounded text-center hover:-translate-y-1 transition"
          >
            Cancel
          </Link>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
