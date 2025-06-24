// src/components/Filters.jsx
import CountrySelect from "./CountrySelect";

const Filters = ({ filters, setFilters, onSubmit, onReset }) => {
  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      {/* Status Filters */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lifecycle Status */}
        <div>
          <label className="font-semibold">Lifecycle Status</label>
          <select
            name="lifecycleStatus"
            value={filters.lifecycleStatus}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                lifecycleStatus: e.target.value,
              }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">All</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="new">New</option>
            <option value="funded">Funded</option>
            <option value="repaid">Repaid</option>
          </select>
        </div>

        {/* Venture Type */}
        <div>
          <label className="font-semibold">Venture Type</label>
          <select
            name="ventureType"
            value={filters.ventureType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, ventureType: e.target.value }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">All</option>
            <option value="business">Business</option>
            <option value="sme">SME</option>
            <option value="leasing">Leasing</option>
            <option value="realestate">Real Estate</option>
          </select>
        </div>
      </section>

      {/* Type & Risk Filters */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Level */}
        <div>
          <label className="font-semibold">Risk Level</label>
          <select
            name="riskLevel"
            value={filters.riskLevel}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, riskLevel: e.target.value }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Is Convertible */}
        <div>
          <label className="font-semibold">Convertible</label>
          <select
            name="isConvertible"
            value={filters.isConvertible}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                isConvertible: e.target.value,
              }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </section>

      {/* Country & Closing In */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <label className="font-semibold">Country</label>
          <CountrySelect
            value={filters.country}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, country: val }))
            }
          />
        </div>

        {/* Closing In */}
        <div>
          <label className="font-semibold">Closing In</label>
          <select
            name="closingIn"
            value={filters.closingIn || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, closingIn: e.target.value }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">Any time</option>
            <option value="1d">1 Day</option>
            <option value="2d">2 Days</option>
            <option value="3d">3 Days</option>
            <option value="7d">1 Week</option>
            <option value="14d">2 Weeks</option>
            <option value="21d">3 Weeks</option>
            <option value="30d">1 Month</option>
            <option value="60d">2 Months</option>
            <option value="90d">3 Months</option>
          </select>
        </div>
      </section>

      {/* Investment Filters */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Min Investment (Dropdown) */}
        <div>
          <label className="font-semibold">Minimum Investment (€)</label>
          <select
            name="minInvestment"
            value={filters.minInvestment || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minInvestment: e.target.value,
              }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">Any</option>
            <option value="100">€100+</option>
            <option value="500">€500+</option>
            <option value="1000">€1,000+</option>
            <option value="5000">€5,000+</option>
            <option value="10000">€10,000+</option>
          </select>
        </div>

        {/* Expected Return (Dropdown) */}
        <div>
          <label className="font-semibold">Expected Return (%)</label>
          <select
            name="expectedReturn"
            value={filters.expectedReturn || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                expectedReturn: e.target.value,
              }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">Any</option>
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((val) => (
              <option key={val} value={val}>
                {val}%+
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Convertible & Search */}
      <section className="grid grid-cols-1 gap-4">
        {/* Search */}
        <div>
          <label className="font-semibold">Search</label>
          <input
            type="text"
            name="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          />
        </div>
      </section>

      {/* Submit & Reset Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <button
          type="submit"
          className="bg-[#00B951] text-white p-4 rounded hover:bg-green-700 hover:-translate-y-1 transition-all"
        >
          Filter Projects
        </button>
        <button
          type="button"
          onClick={onReset}
          className="bg-gray-800 text-white px-12 py-4 rounded hover:-translate-y-1 transition-all"
        >
          Reset Filters
        </button>
      </section>
    </form>
  );
};

export default Filters;
