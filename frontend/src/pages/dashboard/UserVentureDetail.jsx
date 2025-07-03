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
  import placeholder from "./../../assets/logos/logo.png"

  export default function UserVentureDetails() {
    const { ventureId } = useParams();
    const [venture, setVenture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        label: "Admin Review Status",
        value: venture.adminReviewedAt
          ? new Date(venture.adminReviewedAt).toLocaleDateString()
          : "Pending",
      },
      {
        label: "Issued On",
        value: venture.dateIssued
          ? new Date(venture.dateIssued).toLocaleDateString()
          : "Still Not Approved",
      },
      {
        label: "Goes Live At",
        value: venture.goesLiveAt
          ? new Date(venture.goesLiveAt).toLocaleDateString()
          : "Still Not Approved",
      },
      {
        label: "Investment Closing Date",
        value: new Date(venture.closingDate).toLocaleDateString(),
      },
      {
        label: "Created At",
        value: new Date(venture.createdAt).toLocaleDateString(),
      },
      {
        label: "Last Updated At",
        value: new Date(venture.updatedAt).toLocaleDateString(),
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
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Title and Basic Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {venture.title}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
                {[
                  { label: venture.ventureType, color: "blue" },
                  {
                    label: `Lifecycle: ${venture.lifecycleStatus}`,
                    color: "green",
                  },
                  { label: `Risk: ${venture.riskLevel}`, color: "yellow" },
                  { label: `Visibility: ${venture.visibility}`, color: "purple" },
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
              <div className="text-center px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-semibold">
                This is a convertible venture. Investors can convert loans into
                equity.
              </div>
            ) : (
              <div className="text-center px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-semibold">
                This is a non-convertible venture. Investors can not convert loans
                into equity.
              </div>
            )}

            {/* Stats Grid */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
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

            {/* Links to pages */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to={`/dashboard/ventures/${ventureId}/edit-venture-details`}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              >
                Edit Venture Details
              </Link>
              <Link
                to={`/dashboard/ventures/${ventureId}/edit-venture-images`}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              >
                Edit Venture Images
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
