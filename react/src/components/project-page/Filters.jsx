// Filters.jsx
import CountrySelect from "./CountrySelect";

const Filters = ({ filters, setFilters }) => {
  const runningFunction = () => {};

  return (
    <form className="flex flex-col gap-4">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={runningFunction}
            className="border-2 border-gray-400 w-full p-4 mt-2"
          >
            <option value="all">All Projects</option>
            <option value="new">New</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Interest rate</label>
          <div className="flex gap-4 mt-2">
            <input
              name="min_return"
              placeholder="From"
              value={filters.min_return}
              onChange={runningFunction}
              className="border-2 border-gray-400 p-4 w-1/2"
            />
            <input
              name="max_return"
              placeholder="To"
              value={filters.max_return}
              onChange={runningFunction}
              className="border-2 border-gray-400 p-4 w-1/2"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Country</label>
          <CountrySelect
            value={filters.country}
            onChange={(val) => setFilters((f) => ({ ...f, country: val }))}
          />
        </div>
        <div>
          <label className="font-semibold">Loan type</label>
          <select
            name="type"
            value={filters.type}
            onChange={runningFunction}
            className="border-2 border-gray-400 w-full p-4 mt-2"
          >
            <option value="">All</option>
          </select>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <button
          type="submit"
          className="bg-[#00B951] text-white p-4 rounded hover:bg-green-700 hover:-translate-y-1"
        >
          Filter Projects
        </button>
        <button
          type="button"
          onClick={runningFunction}
          className="bg-gray-800 text-white px-12 py-4 rounded hover:-translate-y-1 text-center"
        >
          Reset Filters
        </button>
      </section>
    </form>
  );
};

export default Filters;
