import React from "react";
import { FaBalanceScale } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { RiTeamLine } from "react-icons/ri";
import { HiShieldCheck } from "react-icons/hi";
import { Link } from "react-router-dom";

const values = [
  {
    icon: <FaBalanceScale />,
    title: "Integrity",
    description:
      "At the heart of our organization lies the unwavering principle of integrity, guiding our decisions and actions to foster trust and accountability in every relationship we build.",
    linkText: "Learn more",
  },
  {
    icon: <AiOutlineEye />,
    title: "Transparency",
    description:
      "Our commitment to transparency ensures that we foster trust and open communication, empowering everyone to make informed decisions.",
    linkText: "Learn more",
  },
  {
    icon: <RiTeamLine />,
    title: "Collaboration",
    description:
      "Through collaboration, we harness our diverse strengths to achieve innovative solutions that benefit everyone involved.",
    linkText: "Learn more",
  },
  {
    icon: <HiShieldCheck />,
    title: "Security",
    description:
      "Our commitment to security ensures that we prioritize the protection of our clients' information and assets above all else.",
    linkText: "Learn more",
  },
];

const Values = () => {
  return (
    <div className="bg-green-600 w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto py-16">
      {values.map((item, index) => (
        <div
          key={index}
          className="bg-white flex flex-col justify-between items-start p-8 hover:-translate-y-1 transition-transform shadow-md rounded-md"
        >
          <div>
            <div className="text-4xl text-green-600">{item.icon}</div>
            <h2 className="text-2xl font-semibold mt-8 mb-8 text-gray-700">
              {item.title}
            </h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
          <Link
            to="/about"
            className="mt-8 border-2 border-green-500 px-6 py-2 hover:bg-green-500 hover:text-white font-semibold text-gray-700 transition-colors duration-200"
          >
            {item.linkText}
          </Link>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Values;
