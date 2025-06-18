// components/TeamGrid.tsx
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const teamMembers = [
  {
    name: "John Pigment",
    title: "CEO & Co-founder",
    social: { type: "linkedin", url: "#" },
    email: "mailto:john@example.com",
  },
  {
    name: "Mary Spencer",
    title: "COO & Co-founder",
    social: { type: "linkedin", url: "#" },
    email: "mailto:mary@example.com",
  },
  {
    name: "Liz Stevenson",
    title: "CPA, MBA",
    social: { type: "linkedin", url: "#" },
    email: "mailto:liz@example.com",
  },
  {
    name: "Jessica Jeep",
    title: "CPA, MBA, CFE",
    social: { type: "linkedin", url: "#" },
    email: "mailto:jessica@example.com",
  },
  {
    name: "Martin Foley",
    title: "CPA, MBA",
    social: { type: "linkedin", url: "#" },
    email: "mailto:martin@example.com",
  },
  {
    name: "Britney Jenice",
    title: "CPA",
    social: { type: "linkedin", url: "#" },
    email: "mailto:britney@example.com",
  },
  {
    name: "Chris Black",
    title: "Accounting",
    social: { type: "linkedin", url: "#" },
    email: "mailto:chris@example.com",
  },
  {
    name: "Jenny Brooks",
    title: "Assistant",
    social: { type: "linkedin", url: "#" },
    email: "mailto:jenny@example.com",
  },
];

const iconMap = {
  linkedin: <FaLinkedin className="text-blue-600" />,
  twitter: <FaTwitter className="text-sky-500" />,
  facebook: <FaFacebook className="text-blue-700" />,
  instagram: <FaInstagram className="text-pink-500" />,
};

export default function TeamGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Meet Our Team</h2>
        <p className="text-gray-600 mb-12">
          Get to know the passionate individuals behind our success
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* <div className="h-16 w-16 bg-purple-100 rounded-full mx-auto mb-4" /> */}
              <h3 className="text-2xl mb-4 font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.title}</p>
              <div className="mt-3 flex justify-center gap-4 text-xl">
                {member.social?.url && (
                  <a
                    href={member.social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {iconMap[member.social.type]}
                  </a>
                )}
                {member.email && (
                  <a href={member.email}>
                    <HiOutlineMail className="text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
