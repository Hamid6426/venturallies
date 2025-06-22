import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";

const mainLinks = [
  { title: "Getting Started", href: "/help/getting-started" },
  { title: "How to Register", href: "/help/how-to-register" },
  { title: "How to Invest", href: "/help/how-to-invest" },
  { title: "How to Get Funding", href: "/help/how-to-get-funding" },
];

const supportLinks = [
  { title: "FAQs", href: "/help/faqs" },
  { title: "Platform Terms", href: "/legal/platform-terms" },
  { title: "Terms & Conditions", href: "/legal/terms-and-conditions" },
  { title: "Cookie Policy", href: "/legal/cookie-policy" },
  { title: "Privacy Policy", href: "/legal/privacy-policy" },
  { title: "Guarantees", href: "/legal/guarantees" },
  { title: "Investor Risk Statement", href: "/legal/investor-risk" },
  { title: "Buyback Guarantee", href: "/legal/buyback-guarantee" },
];

export default function Sidebar() {
  const [active, setActive] = useState("How to Invest");

  return (
    <aside className="w-full md:w-64 border-r border-gray-200 p-4 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Help Topics</h3>
        <ul className="space-y-2">
          {mainLinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  active === link.title
                    ? "bg-green-100 text-green-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setActive(link.title)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Legal & Support</h3>
        <ul className="space-y-2">
          {supportLinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  active === link.title
                    ? "bg-green-100 text-green-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setActive(link.title)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
