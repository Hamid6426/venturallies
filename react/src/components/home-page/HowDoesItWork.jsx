import React from "react";
import { MdHelpCenter, MdWork } from "react-icons/md";
import { Link } from "react-router-dom";

const investmentSteps = [
  {
    step: "01",
    title: "Register",
    description:
      "To start investing in our platform by filling in the registration form.",
  },
  {
    step: "02",
    title: "Add funds to your account",
    description:
      "Become an active investor by adding funds to your investor account, as little as €30.",
  },
  {
    step: "03",
    title: "Select projects to invest in",
    description:
      "Create your Auto Invest strategy or manually invest in available projects to diversify your funds across various loan categories.",
  },
  {
    step: "04",
    title: "Track your investments",
    description:
      "View the growth of your investments daily and track your portfolio and returns.",
  },
  {
    step: "05",
    title: "Receive invested principal plus earned interest",
    description:
      "Funds are accessible in your investor account as soon as the project repayment is completed.",
  },
];

export default function HowDoesItWork() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto py-32 px-6">
      {/* Left side: Steps list */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">How does it work?</h2>
        {investmentSteps.map((step, index) => (
          <div key={index} className="border-l-4 border-green-500 pl-4 pr-12">
            <h3 className="text-xl font-semibold text-green-600">
              {step.step}. {step.title}
            </h3>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Right side: Who can invest section */}
      <div className="p-0 mt-8 lg:mt-0 lg:p-8">
        <div className="flex flex-col justify-center items-center space-y-6 text-center p-8 border-2 border-gray-300 rounded-lg bg-gray-100">
          <h2 className="text-2xl font-bold">Who can Invest?</h2>
          <p>
            Individuals and companies can become investors by completing a short
            registration form and activating the investor account by depositing
            initial funds. Keep in mind that you must be at least 18 years old,
            and that we only accept deposits from credit, payment or electronic
            money institutions within the European Union.
          </p>
          <div className="flex justify-center items-center flex-wrap gap-8">
            <Link
              to="/projects"
              className=" hover:-translate-y-1 w-5/12 text-center bg-green-500 py-4 px-6 text-white text-bold flex items-center gap-3 text-lg font-bold"
            >
              <MdWork />
              INVEST NOW
            </Link>
            <Link
              to="/projects"
              className=" hover:-translate-y-1 w-5/12 text-center bg-gray-800 py-4 px-6 text-white text-bold flex items-center gap-3 text-lg font-bold"
            >
              <MdHelpCenter />
              GET HELP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
