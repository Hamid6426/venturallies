import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
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

export default function MyVentureDetail() {
  const { ventureId } = useParams();
  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenture = async () => {
      try {
        const res = await axiosInstance.get(`/ventures/id/${ventureId}`);
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
      value: `${venture.targetAmount?.toLocaleString()} PKR`,
    },
    {
      label: "Amount Funded",
      value: `${venture.amountFunded?.toLocaleString()} PKR`,
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
        ? `${venture.collateralValue.toLocaleString()} PKR`
        : "N/A",
    },
    {
      label: "Loan-to-Value",
      value: venture.loanToValue ? `${venture.loanToValue}%` : "N/A",
    },
    {
      label: "Min Investment",
      value: `${venture.minInvestmentAmount?.toLocaleString()} PKR`,
    },
    {
      label: "Max Investment",
      value: venture.maxInvestmentAmount
        ? `${venture.maxInvestmentAmount.toLocaleString()} PKR`
        : "N/A",
    },
  ];

  const dates = [
    {
      label: "Issued On",
      value: venture.dateIssued
        ? new Date(venture.dateIssued).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Closing Date",
      value: new Date(venture.closingDate).toLocaleDateString(),
    },
    {
      label: "Launch Date",
      value: venture.launchDate
        ? new Date(venture.launchDate).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Goes Live At",
      value: venture.goesLiveAt
        ? new Date(venture.goesLiveAt).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Created At",
      value: new Date(venture.createdAt).toLocaleDateString(),
    },
    {
      label: "Updated At",
      value: new Date(venture.updatedAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Media Section */}
        <div className="aspect-video bg-gray-200 flex justify-center items-center">
          {/* Replace this with a real image or video */}
          <img
            src="/placeholder.jpg"
            alt="Venture"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Title and Basic Info */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {venture.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">
                {venture.ventureType}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full capitalize">
                Status: {venture.status}
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                Risk: {venture.riskLevel}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-md bg-gray-50 shadow-sm"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Funding Progress
            </h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dates.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-md bg-white shadow-sm"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Descriptions */}
          <div className="space-y-6">
            {venture.shortDescription && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                <p className="mt-1 text-gray-700">{venture.shortDescription}</p>
              </div>
            )}
            {venture.longDescription && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                <p className="mt-1 text-gray-700">{venture.longDescription}</p>
              </div>
            )}
            {venture.collateralDescription && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Collateral Details
                </h2>
                <p className="mt-1 text-gray-700">
                  {venture.collateralDescription}
                </p>
              </div>
            )}
          </div>
          <Link
            to={`/account/my-ventures/${ventureId}/edit`}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Edit Venture
          </Link>
        </div>
      </div>
    </div>
  );
}
