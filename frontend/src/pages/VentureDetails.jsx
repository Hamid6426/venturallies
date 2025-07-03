import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import placeholder from "./../assets/logos/logo.png"

export default function VentureDetails() {
  const { ventureId } = useParams();
  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [investLoading, setInvestLoading] = useState(false);
  const [investError, setInvestError] = useState("");
  const [investSuccess, setInvestSuccess] = useState(false);

  useEffect(() => {
    const fetchVenture = async () => {
      try {
        const res = await axiosInstance.get(`/ventures/id/${ventureId}`);
        setVenture(res.data.data);
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

  const riskReturnData = [
    {
      name: venture.title,
      ExpectedReturn: venture.expectedReturn,
      RiskLevel:
        venture.riskLevel === "High"
          ? 3
          : venture.riskLevel === "Medium"
          ? 2
          : 1,
    },
  ];

  const fundingData = [
    {
      name: "Funded",
      value: venture.amountFunded,
    },
    {
      name: "Remaining",
      value: venture.targetAmount - venture.amountFunded,
    },
  ];

  const COLORS = ["#10b981", "#e5e7eb"]; // Green and gray

  const stats = [
    {
      label: "Target Amount",
      value: `€ ${venture.targetAmount?.toLocaleString()}`,
    },
    {
      label: "Amount Funded",
      value: `€ ${venture.amountFunded?.toLocaleString()}`,
    },
    { label: "Expected Return", value: `${venture.expectedReturn}%` },
    {
      label: "Investment Period",
      value: `${venture.investmentPeriod} months`,
    },
    { label: "Country", value: venture.country || "N/A" },
    {
      label: "Collateral Value",
      value: venture.collateralValue
        ? `€ ${venture.collateralValue.toLocaleString()}`
        : "N/A",
    },
    {
      label: "Loan-to-Value",
      value: venture.loanToValue ? `${venture.loanToValue}%` : "N/A",
    },
    {
      label: "Min Investment",
      value: `€ ${venture.minInvestmentAmount?.toLocaleString()}`,
    },
    {
      label: "Max Investment",
      value: venture.maxInvestmentAmount
        ? `€ ${venture.maxInvestmentAmount.toLocaleString()}`
        : "N/A",
    },
  ];

  const dates = [
    {
      label: "Investments Start Date",
      value: venture.goesLiveAt
        ? new Date(venture.goesLiveAt).toLocaleDateString()
        : "Still Not Approved",
    },
    {
      label: "Investment Closing Date",
      value: new Date(venture.closingDate).toLocaleDateString(),
    },
  ];

  if (venture.principal)
    stats.push({
      label: "Principal",
      value: `${venture.principal.toLocaleString()} PKR`,
    });

  if (venture.interest)
    stats.push({
      label: "Interest",
      value: `${venture.interest.toLocaleString()} PKR`,
    });

  if (venture.total)
    stats.push({
      label: "Total Repayment",
      value: `${venture.total.toLocaleString()} PKR`,
    });

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Media Section */}
        <div className="aspect-video bg-gray-200 flex justify-center items-center">
          {/* Replace this with a real image or video */}
          <img
            src={
              venture.images?.[0]
                ? `${import.meta.env.VITE_BACKEND_URL}${venture.images[0]}`
                : placeholder
            }
            alt="Venture"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Title and Basic Info */}
          <div className="">
            <div className="flex flex-col md:flex-row justify-between w-full gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {venture.title}
              </h1>
              {/* <Link
                to={`/projects/${venture._id}/invest`}
                className="text-center max-w-60 px-8 py-3 bg-gray-800 hover:-translate-y-1 transition-all text-white font-bold rounded"
              >
                INVEST IN PROJECT
              </Link>
               */}
              <button
                onClick={() => setShowModal(true)}
                className="text-center max-w-60 px-8 py-3 bg-gray-800 hover:-translate-y-1 transition-all text-white font-bold rounded"
              >
                INVEST IN PROJECT
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm mt-4">
              {[
                { label: `Risk: ${venture.riskLevel}`, color: "yellow" },
                { label: `Admin: ${venture.adminStatus}`, color: "red" },
              ].map(({ label, color }, i) => (
                <span
                  key={i}
                  className={`bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-center capitalize`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {venture.isConvertible ? (
            <div className="mt-4 text-center px-4 text-sm py-2 bg-blue-100 text-blue-800 rounded-md font-semibold">
              This is a convertible venture. Investors can convert loans into
              equity.
            </div>
          ) : (
            <div className="mt-4 text-center px-4 text-sm py-2 bg-blue-100 text-blue-800 rounded-md font-semibold">
              This is a non-convertible venture. Investors can not convert loans
              into equity.
            </div>
          )}

          {/* Stats Grid */}
          <section>
            <h2 className="mt-4 text-xl font-semibold text-gray-800 mb-3">
              Venture Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded bg-white shadow-sm"
                >
                  <p className="text-xs text-gray-500 uppercase">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Funding Progress
            </h2>
            <div className="bg-gray-50 p-4 rounded shadow">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fundingData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {fundingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="bg-white p-6 rounded-md shadow-md mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Risk vs Return
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskReturnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ExpectedReturn" fill="#10b981" />
                <Bar dataKey="RiskLevel" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dates Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-3">
              Key Dates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dates.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded bg-white shadow-sm"
                >
                  <p className="text-xs text-gray-500 uppercase">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Descriptions */}

          <section className="space-y-6 mt-10">
            {venture.shortDescription && (
              <div className="bg-white p-4 rounded-md shadow">
                <h3 className="text-lg font-semibold">Summary</h3>
                <p className="text-gray-700 mt-2">{venture.shortDescription}</p>
              </div>
            )}
            {venture.longDescription && (
              <div className="bg-white p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold">Details</h2>
                <p className="mt-2 text-gray-700">{venture.longDescription}</p>
              </div>
            )}
            {venture.collateralDescription && (
              <div className="bg-white p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold">Collateral Details</h2>
                <p className="mt-2 text-gray-700">
                  {venture.collateralDescription}
                </p>
              </div>
            )}
          </section>

          {/* Tags */}
          {venture.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {venture.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-lg"
              onClick={() => {
                setShowModal(false);
                setAmount("");
                setInvestError("");
              }}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">
              Invest in {venture.title}
            </h2>

            <p className="text-sm mb-2 text-gray-600">
              Min: €{venture.minInvestmentAmount}, Max: €
              {venture.maxInvestmentAmount?.toLocaleString()}
            </p>

            <input
              type="number"
              placeholder="Enter amount (€)"
              className="w-full px-4 py-2 border rounded mb-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={venture.minInvestmentAmount}
            />

            {investError && (
              <p className="text-red-500 text-sm mb-2">{investError}</p>
            )}
            {investSuccess && (
              <p className="text-green-600 text-sm mb-2">
                Investment successful!
              </p>
            )}

            <button
              disabled={investLoading}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
              onClick={async () => {
                const parsedAmount = parseFloat(amount);
                setInvestError("");
                setInvestSuccess(false);

                if (
                  isNaN(parsedAmount) ||
                  parsedAmount < venture.minInvestmentAmount
                ) {
                  return setInvestError(
                    `Minimum investment is €${venture.minInvestmentAmount}`
                  );
                }

                if (parsedAmount > venture.maxInvestmentAmount) {
                  return setInvestError(
                    `Maximum investment is €${venture.maxInvestmentAmount}`
                  );
                }

                setInvestLoading(true);
                try {
                  await axiosInstance.post("/investments", {
                    ventureId: venture._id,
                    amount: parsedAmount,
                  });
                  setInvestSuccess(true);
                  setTimeout(() => {
                    setShowModal(false);
                    window.location.reload(); // Optionally update funding pie
                  }, 1000);
                } catch (err) {
                  setInvestError(
                    err?.response?.data?.message || "Investment failed"
                  );
                } finally {
                  setInvestLoading(false);
                }
              }}
            >
              {investLoading ? "Processing..." : "Confirm Investment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
