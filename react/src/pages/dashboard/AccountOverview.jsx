// src/pages/AccountOverview.jsx
import React from "react";
import { Link } from "react-router-dom";
import AccountSummary from "../../components/overview-page/AccountSummary";

// ✅ Dummy data placeholders (replace with props/context/API)
const user = {
  firstName: "Mian Hamid",
  email: "mianhamid6426@gmail.com",
  lastLoginAt: "2025-06-18T12:45:00Z",
  newsletterFrequency: "weekly",
};

const balance = 320.5;

const investments = [
  {
    ventureTitle: "Organic Farming Venture",
    amount: 500,
    profitPaid: 74.25,
    status: "invested",
  },
  {
    ventureTitle: "Urban Coworking Space",
    amount: 1000,
    profitPaid: 220.1,
    status: "completed",
  },
  {
    ventureTitle: "Eco Housing Project",
    amount: 750,
    profitPaid: 120,
    status: "repaid",
  },
];

const balanceHistory = [
  {
    note: "Investment in Venture A",
    amount: -300,
    balanceBefore: 1500,
    changedAt: "2025-06-12T08:45:00Z",
  },
  {
    note: "Profit from Venture B",
    amount: 124.5,
    balanceBefore: 1200,
    changedAt: "2025-06-10T11:30:00Z",
  },
  {
    note: "Added Funds via Stripe",
    amount: 500,
    balanceBefore: 700,
    changedAt: "2025-06-08T14:15:00Z",
  },
];

const supportTickets = [
  {
    subject: "Cannot withdraw funds",
    status: "Open",
    createdAt: "2025-06-01",
    category: "Payments",
  },
  {
    subject: "Change email address",
    status: "Resolved",
    createdAt: "2025-05-20",
    category: "Account",
  },
  {
    subject: "Bug in investment dashboard",
    status: "In Progress",
    createdAt: "2025-06-15",
    category: "Technical",
  },
];

// Utility functions
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AccountOverview() {
  const activeInvestments = investments.filter(
    (inv) => inv.status === "invested"
  );
  const repaidInvestments = investments.filter(
    (inv) => inv.status === "repaid"
  );

  const expectedReturns = investments.reduce(
    (sum, inv) => sum + inv.profitPaid,
    0
  );
  const totalProfitPaid = expectedReturns;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Welcome back, {user.firstName} 👋</h2>
      <p className="text-sm text-gray-500">
        Last login: {formatDate(user.lastLoginAt)}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Balance"
          value={`€ ${balance.toFixed(2)}`}
          link="/account/funding"
        />
        <SummaryCard
          title="Active Investments"
          value={activeInvestments.length}
          link="/account/investments"
        />
        <SummaryCard
          title="Expected Returns"
          value={`€ ${expectedReturns.toFixed(2)}`}
        />
        <SummaryCard
          title="Profit Earned"
          value={`€ ${totalProfitPaid.toFixed(2)}`}
        />
        <SummaryCard
          title="Repaid Ventures"
          value={repaidInvestments.length}
          link="/account/investments"
        />
        <SummaryCard
          title="Open Tickets"
          value={supportTickets.filter((t) => t.status !== "Closed").length}
        />
      </div>

      {/* Investments */}
      <Section title="Your Investments">
        {investments.length === 0 ? (
          <div className="text-gray-500 text-sm italic">
            You have no investments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-gray-600 font-semibold">
                    Venture
                  </th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">
                    Profit Paid
                  </th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investments.map((inv, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {inv.ventureTitle}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      €{inv.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      €{inv.profitPaid.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Recent Transactions */}
      <Section title="Recent Transactions">
        <div className="flex flex-col gap-4">
          {balanceHistory.length === 0 ? (
            <div className="text-gray-500 text-sm italic">
              No recent transactions.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {balanceHistory.map((tx, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl shadow bg-white border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{tx.note}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(tx.changedAt).toLocaleDateString()} • Balance
                      Before: €{tx.balanceBefore.toFixed(2)}
                    </span>
                  </div>

                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      tx.amount < 0
                        ? "text-red-600 bg-red-100"
                        : "text-green-600 bg-green-100"
                    }`}
                  >
                    {tx.amount < 0 ? "-" : "+"}€{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Support Tickets */}
      <Section title="Support Tickets">
        <div className="flex flex-col gap-4">
          {supportTickets.length === 0 ? (
            <div className="text-gray-500 text-sm italic">
              No support tickets yet.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {supportTickets.map((ticket, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between p-4 rounded-xl shadow bg-white hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {ticket.subject}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {ticket.category} •{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full self-center ${
                      ticket.status === "Open"
                        ? "bg-yellow-100 text-yellow-700"
                        : ticket.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Account Summary */}
      <AccountSummary />
    </div>
  );
}

// 🧩 Summary Card Component
function SummaryCard({ title, value, link }) {
  return (
    <div className="bg-white border rounded shadow p-4 flex flex-col justify-between h-full">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
      {link && (
        <Link to={link} className="text-green-600 text-sm mt-2 hover:underline">
          Manage
        </Link>
      )}
    </div>
  );
}

// 🧩 Section Wrapper
function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-white border rounded shadow p-4">{children}</div>
    </div>
  );
}

// 🧩 Status color helper
function getStatusColor(status) {
  switch (status) {
    case "invested":
      return "bg-blue-100 text-blue-600";
    case "completed":
      return "bg-yellow-100 text-yellow-700";
    case "repaid":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}
