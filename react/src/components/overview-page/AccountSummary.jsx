import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// Color sets
const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"];
const NEGATIVE_COLOR = "#f87171";
const POSITIVE_COLOR = "#34d399";

const AccountSummary = () => {
  const summary = {
    account_balance: 3319.0,
    available_funds: 320.5,
    invested_funds: 2998.5,
    pending_funds: 0,
    in_recovery: 0,
    net_annual_return: 47.04,
    profit: 1599.39,
    late_fees: 2.38,
    bad_debt: 0,
    service_fees: -11.72,
    affiliate_rewards: -28.9,
    portfolio_count: 3,
    portfolio_breakdown: {
      "1 day": 2102.5,
      "15 days": 294.0,
      "30 days": 434.5,
      "60 days": 103.0,
      "Over 60 days": 0.0,
    },
  };

  const balanceChartData = [
    { name: "Available", value: summary.available_funds },
    { name: "Invested", value: summary.invested_funds },
    { name: "Pending", value: summary.pending_funds },
    { name: "In Recovery", value: summary.in_recovery },
  ];

  const returnChartData = [
    { name: "Profit", value: summary.profit },
    { name: "Late Fees", value: summary.late_fees },
    { name: "Bad Debt", value: summary.bad_debt },
    { name: "Service Fees", value: summary.service_fees },
    { name: "Affiliate Rewards", value: summary.affiliate_rewards },
  ];

  const portfolioChartData = Object.entries(summary.portfolio_breakdown).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <main className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Box 1: Account Balance with Donut Chart */}
          <SummaryBox title="Account balance" value={`€${summary.account_balance.toFixed(2)}`} buttonLabel="Add funds">
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={balanceChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {balanceChartData.map((entry, index) => (
                      <Cell key={`cell-balance-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value, name) => [`€${value.toFixed(2)}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {balanceChartData.map((item, i) => (
              <SummaryItem key={i} label={item.name} value={`€${item.value.toFixed(2)}`} />
            ))}
          </SummaryBox>

          {/* Box 2: Net Annual Return with Bar Chart */}
          <SummaryBox
            title="Net annual return"
            value={`${summary.net_annual_return}%`}
            buttonLabel="Invest"
            tooltip="This is your net annualised return (NAR) since you started investing."
          >
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer>
                <BarChart data={returnChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => `€${value.toFixed(2)}`} />
                  <Bar dataKey="value">
                    {returnChartData.map((entry, index) => (
                      <Cell
                        key={`cell-return-${index}`}
                        fill={entry.value < 0 ? NEGATIVE_COLOR : POSITIVE_COLOR}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {returnChartData.map((item, i) => (
              <SummaryItem key={i} label={item.name} value={`€${item.value.toFixed(2)}`} />
            ))}
          </SummaryBox>

          {/* Box 3: Portfolio with Pie Chart */}
          <SummaryBox title="Portfolio" value={summary.portfolio_count} buttonLabel="Investments">
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={portfolioChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                  >
                    {portfolioChartData.map((entry, index) => (
                      <Cell key={`cell-portfolio-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value, name) => [`€${value.toFixed(2)}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {portfolioChartData.map((item, i) => (
              <SummaryItem key={i} label={item.name} value={`€${item.value.toFixed(2)}`} />
            ))}
          </SummaryBox>

        </div>
      </div>
    </main>
  );
};

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

const SummaryItem = ({ label, value, tooltip }) => (
  <div className="flex justify-between items-start gap-2">
    <div className="text-gray-700">
      {label}
      {tooltip && <TooltipInfo message={tooltip} />}
    </div>
    <div className="text-gray-800 font-medium">{value}</div>
  </div>
);

const TooltipInfo = ({ message }) => (
  <span className="ml-1 text-xs text-gray-500 cursor-pointer" title={message}>
    ℹ️
  </span>
);

export default AccountSummary;
