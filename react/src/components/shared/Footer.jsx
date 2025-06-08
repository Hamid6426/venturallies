import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <main className="bg-[#001E0E] w-full ">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-16 text-white max-w-[96rem] mx-auto px-12 py-24 ">
        <section className="w-full max-w-[48rem] mx-auto">
          <img src="/logo.png" alt="Logo" className="h-9 mb-4" />
          <p>
            We empower entrepreneurs, artists, and innovators to launch their
            projects and connect with a passionate audience. From intuitive
            campaign setup and management tools to secure payment processing and
            transparent progress tracking, we offer a complete suite of features
            to guide you through every step of your journey. We believe in
            simplifying the process, so you can focus on what truly matters:
            bringing your vision to life.
          </p>
        </section>
        <section className="flex flex-col gap-4 w-full max-w-[48rem] mx-auto">
          <h2 className="font-bold text-3xl">CONTACT US</h2>
          <div className="flex flex-col gap-1">
            <p>
              <span></span>HQ, Latvia: Str. 13, R?ga, +371 6891 1199
            </p>
            <p>
              <span></span>Estonia: Harju maakond, Tallinn, Kesklinna linnaosa,
              Juhkentali tn 8, 10132 , +372 6891 11999
            </p>
            <p>
              <span></span>Lithuania: Str. 4, Vilnius, +370 6891 1199
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Company</span>Venturallies OÜ
            </p>
            <p>
              <span className="font-bold">Registration No.</span>13472495
            </p>
            <p>
              <span className="font-bold">Contact</span>
              <a href="mailto:hello@venturallies.com">hello@venturallies.com</a>
            </p>
          </div>
        </section>

        {/* EXPLORE SITE */}
        <section className="flex flex-col gap-4 w-full max-w-[48rem] mx-auto">
          <h2 className="font-bold text-3xl">CONTACT US</h2>
          <div className="grid grid-cols-2 text-green-500">
            <Link to="projects" className="hover:text-white">
              Invest
            </Link>
            <Link to="projects" className="hover:text-white">
              How To Invest
            </Link>
            <Link to="projects" className="hover:text-white">
              About Us
            </Link>
            <Link to="projects" className="hover:text-white">
              Get Funding
            </Link>
            <Link to="projects" className="hover:text-white">
              Careers
            </Link>
            <Link to="projects" className="hover:text-white">
              Reports
            </Link>
            <Link to="projects" className="hover:text-white">
              News
            </Link>
            <Link to="projects" className="hover:text-white">
              Affiliate Program
            </Link>
            <Link to="projects" className="hover:text-white">
              Statistics
            </Link>
            <Link to="projects" className="hover:text-white">
              Contact Us
            </Link>
            <Link to="projects" className="hover:text-white">
              Style Guide
            </Link>
            <Link to="projects" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </section>
      </div>
      <div className="max-w-[96rem] w-full mx-auto px-12">
        <hr className=" text-gray-500"></hr>
      </div>{" "}
      <div className="w-full py-8 flex flex-col justify-between items-center lg:flex-row text-white text-lg px-12">
        <p>© Venturallies. All Rights Reserved.</p>
        <p>
          By using this website you agree to the use of cookies in accordance
          with the cookies policy.
        </p>
      </div>
    </main>
  );
}
