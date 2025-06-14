import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const statuses = ["new", "coming-soon", "funded", "repaid"];
const ventureTypes = ["business", "sme", "leasing", "realestate"];
const visibilities = ["public", "private", "draft"];
const riskLevels = ["low", "medium", "high"];

const defaultValues = {
  title: "",
  shortDescription: "",
  longDescription: "",
  collateralDescription: "",
  country: "",
  status: "",
  ventureType: "",
  visibility: "",
  riskLevel: "",
  minInvestmentAmount: "",
  maxInvestmentAmount: "",
  targetAmount: "",
  expectedReturn: "",
  investmentPeriod: "",
  closingDate: "",
  collateralValue: "",
  loanToValue: "",
  isConvertible: false,
};

export default function CreateVenture() {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.ventureType) newErrors.ventureType = "Venture type is required";
    if (!form.targetAmount)
      newErrors.targetAmount = "Target amount is required";
    if (!form.expectedReturn)
      newErrors.expectedReturn = "Expected return is required";
    if (!form.investmentPeriod)
      newErrors.investmentPeriod = "Investment period is required";
    if (!form.closingDate) newErrors.closingDate = "Closing date is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    try {
      const payload = { ...form };

      const res = await axiosInstance.post("/api/ventures", payload);
      const { venture } = res.data;
      const ventureId = venture._id || venture.id;

      alert("Venture created!");
      setForm(defaultValues);
      setErrors({});
      navigate(`/account/create-venture/${ventureId}/upload-images`);
    } catch (err) {
      console.error(err);
      alert("Error creating venture");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Venture</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full input input-bordered"
        />
        {errors.title && <p className="text-red-500">{errors.title}</p>}

        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          placeholder="Short Description"
          className="w-full textarea textarea-bordered"
        />

        <textarea
          name="longDescription"
          value={form.longDescription}
          onChange={handleChange}
          placeholder="Long Description"
          className="w-full textarea textarea-bordered"
        />

        <textarea
          name="collateralDescription"
          value={form.collateralDescription}
          onChange={handleChange}
          placeholder="Collateral Description"
          className="w-full textarea textarea-bordered"
        />

        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full input input-bordered"
        />

        {/* Select fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="">Select Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && <p className="text-red-500">{errors.status}</p>}

          <select
            name="ventureType"
            value={form.ventureType}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="">Select Venture Type</option>
            {ventureTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.ventureType && (
            <p className="text-red-500">{errors.ventureType}</p>
          )}

          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="">Select Visibility</option>
            {visibilities.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            name="riskLevel"
            value={form.riskLevel}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="">Select Risk Level</option>
            {riskLevels.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Investment fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="minInvestmentAmount"
            value={form.minInvestmentAmount}
            onChange={handleChange}
            placeholder="Min Investment"
            className="input input-bordered"
          />
          <input
            type="number"
            name="maxInvestmentAmount"
            value={form.maxInvestmentAmount}
            onChange={handleChange}
            placeholder="Max Investment"
            className="input input-bordered"
          />
          <input
            type="number"
            name="targetAmount"
            value={form.targetAmount}
            onChange={handleChange}
            placeholder="Target Amount"
            className="input input-bordered"
          />
          {errors.targetAmount && (
            <p className="text-red-500">{errors.targetAmount}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="expectedReturn"
            value={form.expectedReturn}
            onChange={handleChange}
            placeholder="Expected Return (%)"
            className="input input-bordered"
          />
          <input
            type="number"
            name="investmentPeriod"
            value={form.investmentPeriod}
            onChange={handleChange}
            placeholder="Investment Period (months)"
            className="input input-bordered"
          />
          <input
            type="date"
            name="closingDate"
            value={form.closingDate}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>

        {/* Collateral Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            name="collateralValue"
            value={form.collateralValue}
            onChange={handleChange}
            placeholder="Collateral Value"
            className="input input-bordered"
          />
          <input
            type="number"
            name="loanToValue"
            value={form.loanToValue}
            onChange={handleChange}
            placeholder="Loan-to-Value (%)"
            className="input input-bordered"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isConvertible"
              checked={form.isConvertible}
              onChange={handleChange}
            />
            <span>Convertible to Equity?</span>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-4">
          Create Venture
        </button>
      </form>
    </div>
  );
}
