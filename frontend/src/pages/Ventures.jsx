import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdInfoOutline } from "react-icons/md";
import Filters from "../components/project-page/Filters";
import axiosInstance from "../utils/axiosInstance";
import Tooltip from "../components/common/Tooltip";
import placeholder from "./../assets/logos/logo.png"

export default function Ventures() {
  const defaultFilters = {
    lifecycleStatus: "all",
    ventureType: "all",
    riskLevel: "all",
    isConvertible: "all",
    country: "all",
    closingIn: "",
    minInvestment: "",
    expectedReturn: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 9,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const [ventures, setVentures] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  function generateCacheKey(base, filters) {
    const sorted = Object.keys(filters)
      .sort()
      .reduce((obj, key) => {
        obj[key] = filters[key];
        return obj;
      }, {});
    return `${base}:${JSON.stringify(sorted)}`;
  }

  useEffect(() => {
    const fetchVentures = async () => {
      setLoading(true);

      const cacheKey = generateCacheKey("ventures", filters);
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(`${cacheKey}:time`);
      const cacheDuration = 5 * 60 * 1000; // 5 minutes

      if (
        cachedData &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < cacheDuration
      ) {
        const parsed = JSON.parse(cachedData);
        setVentures(parsed.ventures);
        setPagination(parsed.pagination);
        setLoading(false);
        return;
      }

      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axiosInstance.get(`/ventures?${query}`);
        const data = res.data;

        const payload = {
          ventures: data.data || [],
          pagination: data.pagination || null,
        };

        setVentures(payload.ventures);
        setPagination(payload.pagination);

        localStorage.setItem(cacheKey, JSON.stringify(payload));
        localStorage.setItem(`${cacheKey}:time`, Date.now().toString());
      } catch (err) {
        console.error("Failed to fetch ventures:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, [filters]);

  const buildFiltersFromForm = (form) => {
    const result = { ...defaultFilters };

    for (const key in defaultFilters) {
      const value = form.get(key);
      if (value !== null) {
        result[key] = value;
      }
    }

    result.page = 1;
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newFilters = buildFiltersFromForm(form);
    setFilters(newFilters);
  };

  const handleReset = () => {
    // Optional: Clear venture cache
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("ventures:")) {
        localStorage.removeItem(key);
      }
    });

    setFilters(defaultFilters);
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full pb-32 px-6">
      <div className="w-full flex flex-col justify-center items-center py-20 bg-gray-100 gap-6 mb-8">
        {/* <img src="sample-header.jpg" alt="header-image" className="absolute opacity-40"/> */}
        <h2 className="text-4xl w-full font-semibold text-center ">Projects</h2>
      </div>

      <Filters
        filters={filters}
        setFilters={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {loading ? (
        <p className="text-center py-12 mt-8">Loading...</p>
      ) : ventures.length > 0 ? (
        ventures.map((project) => {
          const target = project.targetAmount || 0;
          const invested = project.amountFunded || 0;
          const progress = target > 0 ? (invested / target) * 100 : 0;
          const minimumGoal = 20; // Optional: set from backend if available
          const remaining = Math.max(0, 100 - (progress + minimumGoal));
          const daysLeft = Math.max(
            0,
            Math.ceil(
              (new Date(project.closingDate) - new Date()) /
                (1000 * 60 * 60 * 24)
            )
          );

          return (
            <div
              key={project._id}
              className="flex flex-col mt-12 lg:flex-row w-full h-full mb-12 border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={
                  `${import.meta.env.VITE_BACKEND_URL}` + project.images?.[0] ||
                  placeholder
                }
                alt={project.title}
                className="border-r border-gray-200 object-cover w-full lg:w-5/12 aspect-video"
              />
              <div className="p-8 w-full lg:w-7/12 h-full flex flex-col justify-between items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>

                    <Tooltip
                      message={
                        project.isConvertible
                          ? "Convertible: Investors can convert their loan into equity later, sharing in future growth."
                          : "Non-convertible: Ventures with no equity conversion but generally have higher interest rate."
                      }
                    >
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MdInfoOutline className="mr-2" />
                        {project.isConvertible
                          ? "Convertible"
                          : "Non-Convertible"}
                      </div>
                    </Tooltip>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {project.shortDescription}
                  </p>

                  <table className="w-full text-left mb-4">
                    <thead>
                      <tr className="text-sm text-gray-600">
                        <th className="pb-1">Expected Return</th>
                        <th className="pb-1">Term Period</th>
                        <th className="pb-1">Investments Close At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-md font-medium">
                        <td>{project.expectedReturn}%</td>
                        <td>{project.investmentPeriod} months</td>
                        <td>{daysLeft} days</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex h-4 w-full rounded-full overflow-hidden mb-6">
                    <div
                      className="bg-green-500"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="bg-yellow-200"
                      style={{ width: `${minimumGoal}%` }}
                    />
                    <div
                      className="bg-gray-300"
                      style={{ width: `${remaining}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
                  <Link
                    to={`/projects/${project._id}`}
                    className="w-full text-center py-4 bg-green-600 hover:-translate-y-1 transition-all text-white font-bold rounded"
                  >
                    DETAILS
                  </Link>
                  <Link
                    to={`/projects/${project._id}/invest`}
                    className="w-full text-center py-4 bg-gray-800 hover:-translate-y-1 transition-all text-white font-bold rounded"
                  >
                    INVEST
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="border border-gray-300 py-12 flex flex-col items-center justify-center mt-16 text-center space-y-4">
          <MdInfoOutline className="text-5xl text-gray-400" />
          <h4 className="text-xl font-semibold text-gray-700">
            No projects match your current filters.
          </h4>
          <p className="text-gray-600 max-w-md">
            Try adjusting your filters or clearing them to see more available
            investment opportunities.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-green-600 text-white rounded hover:-translate-y-1 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(pagination.totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setFilters((prev) => ({ ...prev, page: idx + 1 }))}
              className={`px-3 py-1 border rounded ${
                filters.page === idx + 1
                  ? "bg-green-500 text-white"
                  : "bg-white"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto mt-12">
        <Link
          to="/"
          className="w-full py-4 px-8 bg-gray-800 hover:-translate-y-1 transition-all text-white text-center font-bold rounded"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
