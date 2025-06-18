import {
  FaMailBulk,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdHelpCenter, MdWork } from "react-icons/md";

const cards = [
  {
    icon: <FaMailBulk size={28} className="text-green-700" />,
    title: "Email Us",
    content: "hello@venturallies.com",
  },
  {
    icon: <FaPhoneAlt size={28} className="text-green-700" />,
    title: "Call Us",
    content: "+371 6891 1199",
  },
  {
    icon: <FaMapMarkerAlt size={28} className="text-green-700" />,
    title: "Visit Us",
    content: "Venturallies office, Juhkentali 8, 10132 Tallinn, Estonia",
  },
  {
    icon: <FaClock size={28} className="text-green-700" />,
    title: "Working Hours",
    content: "Mon-Fri: 9AM - 6PM",
  },
];

export default function Contact() {
  return (
    <div className="w-full">
      <section className="w-full flex flex-col justify-center items-center py-20 bg-gray-100 gap-6">
        {/* <img src="sample-header.jpg" alt="header-image" className="absolute opacity-40"/> */}
        <h2 className="text-3xl w-full font-semibold text-center ">
          Get in touch
        </h2>
      </section>
      <section className="px-6 py-16">
        <h2 className="text-3xl w-full font-semibold">How can we help?</h2>
        <p className="max-w-xl mt-6">
          we understand that reaching out can sometimes feel like a hurdle.
          That's why we've made it our priority to make getting in touch with us
          as easy and accessible as possible. Whether you prefer a quick email,
          a direct phone call, or even a casual chat via our social media
          channels, we're here to listen. More importantly, we're committed to
          understanding your specific needs and tailoring our support to best
          address them. By making it simple to connect, we can begin the journey
          toward providing you with the exact help you're looking for.
        </p>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-start p-8 gap-16 bg-white rounded-xl shadow-md"
          >
            {card.icon}
            <div>
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="text-gray-600">{card.content}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-green-800 relative flex flex-col justify-center items-center space-y-6 text-center py-32 px-6 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Earn income while investing in meaningful businesses.
          </h2>

          <div className="flex justify-center items-center gap-6">
            <Link
              to="/projects"
              className="hover:-translate-y-1 transition-transform bg-green-500 py-4 px-6 text-white flex items-center gap-3 text-lg font-bold rounded"
            >
              <MdWork />
              INVEST NOW
            </Link>
            <Link
              to="/projects"
              className="hover:-translate-y-1 transition-transform border-2 border-white py-4 px-6 text-white flex items-center gap-3 text-lg font-bold rounded"
            >
              <MdHelpCenter />
              GET HELP
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
