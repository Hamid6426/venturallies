// src/pages/User/UserWallet.jsx

import { useBalance } from "../../contexts/BalanceContext";

const formatCurrency = (val) => {
  const num = Number(val);
  return !isNaN(num) ? `€ ${num.toFixed(2)}` : "—";
};

export default function UserWallet() {
  const { balance, loading, error } = useBalance();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Wallet Overview</h1>

      {loading ? (
        <p className="text-gray-500">Loading balance...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : balance ? (
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg text-gray-600 mb-2">Available Balance</h2>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(balance.balance)}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No balance data available.</p>
      )}
    </div>
  );
}
