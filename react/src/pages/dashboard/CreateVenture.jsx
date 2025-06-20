import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

// Constants
const ventureTypes = ["business", "sme", "leasing", "realestate"];
const riskLevels = ["low", "medium", "high"];

const defaultValues = {
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
  collateralValue: "",
  loanToValue: "",
  isConvertible: false,
};

export default function CreateVenture() {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const requiredFields = [
      "title",
      "country",
      "shortDescription",
      "longDescription",
      "collateralDescription",
      "ventureType",
      "targetAmount",
      "expectedReturn",
      "investmentPeriod",
      "closingDate",
      "minInvestmentAmount",
      "maxInvestmentAmount",
      "collateralValue",
      "loanToValue",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]) {
        const label = field.replace(/([A-Z])/g, " $1");
        newErrors[field] = `${
          label.charAt(0).toUpperCase() + label.slice(1)
        } is required`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, val]) => [
          key,
          typeof val === "string" ? val.trim() : val,
        ])
      );

      // Cast numeric + date fields
      payload.minInvestmentAmount = +payload.minInvestmentAmount;
      payload.maxInvestmentAmount = +payload.maxInvestmentAmount;
      payload.targetAmount = +payload.targetAmount;
      payload.expectedReturn = +payload.expectedReturn;
      payload.investmentPeriod = +payload.investmentPeriod;
      payload.collateralValue = +payload.collateralValue;
      payload.loanToValue = +payload.loanToValue;
      payload.closingDate = new Date(payload.closingDate);

      // Hardcoded fields
      payload.lifecycleStatus = "coming-soon";
      payload.visibility = "draft";
      payload.dateIssued = null; // Issued when approved

      const res = await axiosInstance.post("/ventures", payload);
      const { venture } = res.data;
      const ventureId = venture._id || venture.id;

      alert("Venture created!");
      setForm(defaultValues);
      setErrors({});
      setIsSubmitting(false);
      navigate(`/account/create-venture/${ventureId}/upload-images`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating venture");
      setIsSubmitting(false);
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
        {/* Basic Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium md:mb-0 w-full md:w-72">Basic Info</h4>
          <div className="w-full space-y-4">
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Venture Title"
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            <input
              name="country"
              type="text"
              value={form.country}
              onChange={handleChange}
              placeholder="Country (e.g. Cameroon)"
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>
        </section>

        {/* Descriptions */}
        {[
          ["Short Description", "shortDescription", "Brief summary of the venture"],
          ["Long Description", "longDescription", "Detailed overview of the venture"],
          ["Collateral Description", "collateralDescription", "Description of the asset used as collateral"],
        ].map(([label, name, placeholder]) => (
          <section key={name} className="flex flex-col md:flex-row gap-6">
            <h4 className="text-xl font-medium md:mb-0 w-full md:w-72">{label}</h4>
            <textarea
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-400 px-2 py-2 focus:outline-[#00B951] focus:border-[#00B951]"
              placeholder={placeholder}
              rows={3}
            />
          </section>
        ))}

        {/* Selections */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Selections</h4>
          <div className="grid grid-cols-1 gap-4 w-full">
            {[["ventureType", ventureTypes], ["riskLevel", riskLevels]].map(
              ([name, options]) => (
                <div key={name}>
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
                  >
                    <option value="">Select {name === "ventureType" ? "Venture Type" : "Risk Level"}</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o.charAt(0).toUpperCase() + o.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              )
            )}
          </div>
        </section>

        {/* Investment Details */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Investment Details</h4>
          <div className="grid grid-cols-1 gap-4 w-full">
            {[
              ["minInvestmentAmount", "Minimum Investment Amount (USD)"],
              ["maxInvestmentAmount", "Maximum Investment Amount (USD)"],
              ["targetAmount", "Target Funding Amount (USD)"],
              ["expectedReturn", "Expected Return (%)"],
              ["investmentPeriod", "Investment Period (in months)"],
            ].map(([name, placeholder]) => (
              <div key={name}>
                <input
                  type="number"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
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

        {/* Collateral Info */}
        <section className="flex flex-col md:flex-row gap-6">
          <h4 className="text-xl font-medium w-full md:w-64">Collateral Info</h4>
          <div className="grid grid-cols-1 gap-4 w-full">
            <input
              type="number"
              name="collateralValue"
              value={form.collateralValue}
              onChange={handleChange}
              placeholder="Collateral Value (USD)"
              className="border-b-2 border-gray-400 px-2 py-2 w-full focus:outline-[#00B951] focus:border-[#00B951]"
            />
            <input
              type="number"
              name="loanToValue"
              value={form.loanToValue}
              onChange={handleChange}
              placeholder="Loan-to-Value Ratio (%)"
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

        {/* Submit */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#00B951] text-white px-12 py-4 rounded hover:bg-green-700 hover:-translate-y-1 transition-transform"
          >
            {isSubmitting ? "Creating..." : "Create Venture"}
          </button>
        </div>
      </form>
    </div>
  );
}
