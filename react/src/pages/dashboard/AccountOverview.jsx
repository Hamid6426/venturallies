import React from "react";
import AccountSummary from "../../components/overview-page/AccountSummary";

export default function AccountOverview() {
  return (
    <>
      <h2 className="text-4xl w-full font-semibold text-center py-20 bg-gray-100">
        Overview
      </h2>
      <AccountSummary />
    </>
  );
}
