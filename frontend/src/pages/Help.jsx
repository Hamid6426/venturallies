import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { MdClose, MdMenu } from "react-icons/md";

const helpSections = [
  {
    group: "Help Topics",
    items: [
      {
        title: "Getting Started",
        content:
          "Welcome to our platform! Learn the basics of getting started.",
      },
      {
        title: "How to Register",
        content: `Our registration process is very simple – all you need to do is to fill in the registration form by providing your personal details and contact information.

After that, simply become an active investor by adding funds to your investor account, as little as €30.

Keep in mind that you must be at least 18 years old, and that we only accept deposits from credit, payment or electronic money institutions within the European Union.`,
      },
      {
        title: "How to Invest",
        content:
          "To invest, browse available ventures and choose one. Fund your wallet and invest with as little as €30.",
      },
      {
        title: "How to Get Funding",
        content:
          "Looking to raise capital? Submit your venture details and go through our approval process.",
      },
    ],
  },
  {
    group: "Legal & Support",
    items: [
      {
        title: "FAQs",
        content:
          "Frequently Asked Questions – everything you need to know before getting started.",
      },
      {
        title: "Platform Terms",
        content: "Read the specific terms for using our platform.",
      },
      {
        title: "Terms & Conditions",
        content: "Legal agreement between you and our platform.",
      },
      {
        title: "Cookie Policy",
        content: "We use cookies to enhance your experience. Read more here.",
      },
      {
        title: "Privacy Policy",
        content: "How we manage your data securely and transparently.",
      },
      {
        title: "Guarantees",
        content: "Information about our guarantees and investor security.",
      },
      {
        title: "Investor Risk Statement",
        content: "Investment involves risks. Please read carefully.",
      },
      {
        title: "Buyback Guarantee",
        content: "Under certain conditions, we offer a buyback guarantee.",
      },
    ],
  },
];

const HelpPage = () => {
  const [activeTitle, setActiveTitle] = useState(
    helpSections[0].items[1].title
  ); // default "How to Register"
  const [feedback, setFeedback] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeContent = helpSections
    .flatMap((section) => section.items)
    .find((item) => item.title === activeTitle)?.content;

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Toggle */}

      {/* Sidebar */}
      <aside
        className={`border-r border-gray-200 space-y-6 bg-white md:block`}
      >
        <div className="md:hidden px-4 pt-6">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
          <div className="h-full w-1 bg-gray-400 " />
        </div>
        <div
          className={`w-64 border-r border-gray-200 space-y-6 px-4 md:py-6 bg-white 
    ${menuOpen ? "block" : "hidden"} md:block`}
        >
          {helpSections.map((section) => (
            <div key={section.group}>
              <h2 className="text-lg font-semibold mb-3">{section.group}</h2>
              <ul className="space-y-2">
                {section.items.map(({ title }) => (
                  <li key={title}>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm transition ${
                        activeTitle === title
                          ? "bg-green-100 text-green-700 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => {
                        setActiveTitle(title);
                        setMenuOpen(false); // ✅ This is the correct place
                      }}
                    >
                      {title}
                      <FaChevronRight className="text-xs" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {activeTitle}
        </h1>
        <div className="prose max-w-3xl whitespace-pre-wrap text-gray-700">
          {activeContent}
        </div>

        {/* Helpful section */}
        <div className="mt-12 border-t pt-6">
          <p className="text-sm text-gray-600 mb-2">
            Was this article helpful?
          </p>

          {feedback === null ? (
            <div className="flex gap-4">
              <button
                onClick={() => setFeedback("yes")}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Yes
              </button>
              <button
                onClick={() => setFeedback("no")}
                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                No
              </button>
            </div>
          ) : feedback === "yes" ? (
            <button className="px-4 py-2 text-sm bg-green-200 text-green-800 rounded cursor-default">
              Thanks for your feedback! 👍
            </button>
          ) : (
            <button className="px-4 py-2 text-sm bg-red-200 text-red-800 rounded cursor-default">
              We'll work on improving this! 👀
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
