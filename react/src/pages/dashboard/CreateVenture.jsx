import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

// Constants
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
    if (!form.targetAmount) newErrors.targetAmount = "Target amount is required";
    if (!form.expectedReturn) newErrors.expectedReturn = "Expected return is required";
    if (!form.investmentPeriod) newErrors.investmentPeriod = "Investment period is required";
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
      const res = await axiosInstance.post("/ventures", payload);
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
    <div className="mx-auto">
      <h2 className="text-4xl font-semibold mb-6 text-center py-20 bg-gray-100">
        Create New Venture
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 text-lg md:text-xl max-w-4xl mx-auto py-16 px-4"
      >
        {/* Venture Basic Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">Basic Info</h4>
          <div className="w-full space-y-4">
            {["title", "country"].map((name) => (
              <div key={name}>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
                />
                {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Descriptions */}
        {[
          ["Short Description", "shortDescription"],
          ["Long Description", "longDescription"],
          ["Collateral Description", "collateralDescription"],
        ].map(([label, name]) => (
          <section key={name} className="flex flex-col md:flex-row gap-6">
            <h4 className="text-xl font-medium md:mb-0 w-full md:w-64">{label}</h4>
            <textarea
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-400 px-2 py-2 focus:outline-[#00B951] focus:border-[#00B951]"
              placeholder={label}
              rows={3}
            />
          </section>
        ))}

        {/* Select Dropdowns */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Selections</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {[["status", statuses], ["ventureType", ventureTypes], ["visibility", visibilities], ["riskLevel", riskLevels]].map(
              ([name, options]) => (
                <div key={name}>
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
                  >
                    <option value="">Select {name}</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              )
            )}
          </div>
        </section>

        {/* Investment Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Investment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[
              "minInvestmentAmount",
              "maxInvestmentAmount",
              "targetAmount",
              "expectedReturn",
              "investmentPeriod",
            ].map((name) => (
              <div key={name}>
                <input
                  type="number"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={name.replace(/([A-Z])/g, " $1")}
                  className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
                />
                {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Closing Date */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Closing Date</h4>
          <div className="w-full">
            <input
              type="date"
              name="closingDate"
              value={form.closingDate}
              onChange={handleChange}
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
            />
            {errors.closingDate && <p className="text-red-500 text-sm">{errors.closingDate}</p>}
          </div>
        </section>

        {/* Collateral Fields */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Collateral Info</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <input
              type="number"
              name="collateralValue"
              value={form.collateralValue}
              onChange={handleChange}
              placeholder="Collateral Value"
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
            />
            <input
              type="number"
              name="loanToValue"
              value={form.loanToValue}
              onChange={handleChange}
              placeholder="Loan-to-Value (%)"
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isConvertible"
                checked={form.isConvertible}
                onChange={handleChange}
                className="mr-2"
              />
              Convertible to Equity
            </label>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1 transition-transform"
          >
            Create Venture
          </button>
        </div>
      </form>
    </div>
  );
}
