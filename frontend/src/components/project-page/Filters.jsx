import CountrySelect from "./CountrySelect";

const Filters = ({ filters, setFilters, onSubmit, onReset }) => {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Venture Type */}
        <div>
          <label className="font-semibold">Venture Type</label>
          <select
            name="ventureType"
            value={filters.ventureType}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                ventureType: e.target.value,
              }))
            }
            className="border-2 border-gray-400 w-full px-4 py-2 mt-2"
          >
            <option value="">All</option>
            <option value="loan">Loan</option>
            <option value="equity">Equity</option>
          </select>
        </div>
      </section>

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

      {/* Submit + Reset */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <button
          type="submit"
          className="bg-[#00B951] text-white p-4 rounded hover:bg-green-700 hover:-translate-y-1"
        >
          Filter Projects
        </button>
        <button
          type="button"
          onClick={onReset}
          className="bg-gray-800 text-white px-12 py-4 rounded hover:-translate-y-1 text-center"
        >
          Reset Filters
        </button>
      </section>
    </form>
  );
};

export default Filters;
