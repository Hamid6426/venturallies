// Importing React and specific chart components from 'recharts'
import React from "react";
import {
  PieChart, // Chart container for Pie
  Pie, // Actual Pie representation
  BarChart, // Chart container for Bar
  Bar, // Actual Bar representation
  XAxis, // Horizontal axis
  YAxis, // Vertical axis
  Cell, // Used to color individual chart items
  Tooltip as RechartsTooltip, // Tooltip component for charts (renamed)
  ResponsiveContainer, // Makes charts responsive
} from "recharts";

const formatCurrency = (val) => {
  const num = Number(val);
  return !isNaN(num) ? `€${num.toFixed(2)}` : "—";
};

// Predefined color palette for chart segments
const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"];
const NEGATIVE_COLOR = "#f87171"; // Red for negative values (losses, fees)
const POSITIVE_COLOR = "#34d399"; // Green for positive values (profits, returns)

const AccountSummary = () => {
  // Core financial data summary object
  const summary = {
    account_balance: 3319.0, // Total balance in the account
    available_funds: 320.5, // Unallocated funds available
    invested_funds: 2998.5, // Funds currently invested
    pending_funds: 0, // Funds pending allocation
    in_recovery: 0, // Funds in recovery process
    net_annual_return: 47.04, // Annualized return percentage
    profit: 1599.39, // Profit made to date
    late_fees: 2.38, // Earnings from late fees
    bad_debt: 0, // Amount lost to bad debts
    service_fees: -19.95, // Service fees paid (increased from -11.72)
    portfolio_count: 3, // Number of active portfolios
  };

  // Data for the donut chart showing fund distribution
  const balanceChartData = [
    { name: "Available", value: summary.available_funds },
    { name: "Invested", value: summary.invested_funds },
    { name: "Pending", value: summary.pending_funds },
    { name: "In Recovery", value: summary.in_recovery },
  ];

  // Data for the bar chart showing returns and fees
  const returnChartData = [
    { name: "Profit", value: summary.profit },
    { name: "Late Fees", value: summary.late_fees },
    { name: "Bad Debt", value: summary.bad_debt },
    { name: "Service Fees", value: summary.service_fees }, // Adjusted fee
  ];

  return (
    <main className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Box 1: Displays account balance and pie chart for fund distribution */}
          <SummaryBox
            title="Account balance"
            value={formatCurrency(summary.account_balance)}
            buttonLabel="Add funds"
          >
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={balanceChartData}
                    dataKey="value" // Value field in data
                    nameKey="name" // Label field in data
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {balanceChartData.map((entry, index) => (
                      <Cell
                        key={`cell-balance-${index}`} // Unique key
                        fill={COLORS[index % COLORS.length]} // Color from palette
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name) => [formatCurrency(value), name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Text summary below chart */}
            {balanceChartData.map((item, i) => (
              <SummaryItem
                key={i}
                label={item.name}
                value={formatCurrency(item.value)}
              />
            ))}
          </SummaryBox>

          {/* Box 2: Displays return summary with a bar chart */}
          <SummaryBox
            title="Net annual return"
            value={`${summary.net_annual_return}%`}
            buttonLabel="Invest"
            tooltip="This is your net annualised return (NAR) since you started investing."
          >
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer>
                <BarChart data={returnChartData}>
                  <XAxis dataKey="name" /> {/* X-axis shows metric names */}
                  <YAxis /> {/* Y-axis shows value scale */}
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="value">
                    {returnChartData.map((entry, index) => (
                      <Cell
                        key={`cell-return-${index}`}
                        fill={entry.value < 0 ? NEGATIVE_COLOR : POSITIVE_COLOR} // Dynamic bar color
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Text summary below chart */}
            {returnChartData.map((item, i) => (
              <SummaryItem
                key={i}
                label={item.name}
                value={formatCurrency(item.value)}
              />
            ))}
          </SummaryBox>
        </div>
      </div>
    </main>
  );
};

// Reusable UI box component
const SummaryBox = ({ title, value, children, buttonLabel, tooltip }) => (
  <div className="bg-gray-100 shadow rounded-2xl p-6">
    <h4 className="text-lg font-semibold mb-2 flex items-center gap-1">
      {title} {tooltip && <TooltipInfo message={tooltip} />}
    </h4>
    <h3 className="text-3xl font-bold text-tomatoRose-700 mb-4">{value}</h3>
    <hr className="mb-4" />
    <div className="space-y-2 text-sm">{children}</div>
    <button className="mt-6 w-full bg-tomatoRose-600 text-white py-2 rounded-xl hover:bg-tomatoRose-700">
      {buttonLabel}
    </button>
  </div>
);

// Row item for each chart legend or data summary
const SummaryItem = ({ label, value, tooltip }) => (
  <div className="flex justify-between items-start gap-2">
    <div className="text-gray-700">
      {label}
      {tooltip && <TooltipInfo message={tooltip} />}
    </div>
    <div className="text-gray-800 font-medium">{value}</div>
  </div>
);

// Tooltip icon with message shown on hover
const TooltipInfo = ({ message }) => (
  <span className="ml-1 text-xs text-gray-500 cursor-pointer" title={message}>
    ℹ️
  </span>
);

// Exporting component for use in the app
export default AccountSummary;
