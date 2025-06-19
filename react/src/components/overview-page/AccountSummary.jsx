const AccountSummary = () => {
  return (
    <main className="py-10  ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Box 1: Account Balance */}
          <div className="shadow rounded-2xl p-6 bg-gray-100">
            <h4 className="text-lg font-semibold mb-2">Account balance</h4>
            <h3 className="text-3xl font-bold text-tomatoRose-700 mb-4">€3213.50</h3>
            <hr className="mb-4" />
            <div className="space-y-2 text-sm">
              <SummaryItem label="Available funds" value="€215.50" />
              <SummaryItem label="Invested funds" value="€2998.50" />
              <SummaryItem label="Pending funds" value="€0.00" tooltip="Money that is currently in the process of being credited to your account. Pending payments can include both current and finished investments." />
              <SummaryItem label="In recovery" value="€0.00" />
            </div>
            <button className="mt-6 w-full bg-tomatoRose-600 text-white py-2 rounded-xl hover:bg-tomatoRose-700">
              Add funds
            </button>
          </div>

          {/* Box 2: Net Annual Return */}
          <div className="bg-gray-100 shadow rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-2">
              Net annual return{" "}
              <TooltipInfo message="Net annualised return (NAR) measures the actual rate of return of all your investments since you started." />
            </h4>
            <h3 className="text-3xl font-bold text-tomatoRose-700 mb-4">11.5%</h3>
            <hr className="mb-4" />
            <div className="space-y-2 text-sm">
              <SummaryItem label="Profit" value="€1599.39" />
              <SummaryItem label="Late Fees" value="€2.38" />
              <SummaryItem label="Bad Debt" value="€0.00" />
              <SummaryItem label="Service Fees" value="-€11.72" tooltip="Service fees include currency exchange fees, secondary market fees, inactivity fees, as well as historical fees." />
              <SummaryItem label="Affiliate Rewards" value="-€28.90" />
            </div>
            <button className="mt-6 w-full bg-tomatoRose-600 text-white py-2 rounded-xl hover:bg-tomatoRose-700">
              Invest
            </button>
          </div>

          {/* Box 3: Portfolio */}
          <div className="bg-gray-100 shadow rounded-2xl p-6">
            <h4 className="text-lg font-semibold mb-2">Portfolio</h4>
            <h3 className="text-3xl font-bold text-tomatoRose-700 mb-4">27</h3>
            <hr className="mb-4" />
            <div className="space-y-2 text-sm">
              <SummaryItem label="Current" value="€2102.50" tooltip="These loans are up to date on all outstanding payments." />
              <SummaryItem label="1-15 Days Late" value="€294.00" tooltip="Payments for this loan are 1 to 15 days late." />
              <SummaryItem label="16-30 Days Late" value="€434.50" tooltip="Payments for this loan are 16 to 30 days late." />
              <SummaryItem label="31-60 Days Late" value="€103.00" tooltip="Payments for this loan are 31 to 60 days late." />
              <SummaryItem label="60+ Days Late" value="€0.00" tooltip="Payments for this loan are more than 60 days late. There is a reasonable expectation that the borrower will be able to bring the loan back to current status." />
            </div>
            <button className="mt-6 w-full bg-tomatoRose-600 text-white py-2 rounded-xl hover:bg-tomatoRose-700">
              Investments
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};

const SummaryItem = ({ label, value, tooltip }) => (
  <div className="flex justify-between items-start gap-2">
    <div className="text-gray-700">
      {label}
      {tooltip && (
        <TooltipInfo message={tooltip} />
      )}
    </div>
    <div className="text-gray-800 font-medium">{value}</div>
  </div>
);

const TooltipInfo = ({ message }) => (
  <span
    className="ml-1 text-xs text-gray-500 cursor-pointer"
    title={message}
  >
    ℹ️
  </span>
);

export default AccountSummary;
