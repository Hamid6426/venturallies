import { Link } from "react-router-dom";
import Values, { values } from "../components/home-page/Values";
import TeamGrid from "../components/about-page/TeamGrid";

export default function About() {
  return (
    <div>
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col justify-center items-center py-20 bg-gray-100 gap-6">
          {/* <img src="sample-header.jpg" alt="header-image" className="absolute opacity-40"/> */}
          <h2 className="text-4xl w-full font-semibold text-center ">
            About Us
          </h2>
          <div className="w-16 h-1 bg-gray-400"></div>
          <p className="font-light uppercase">Putting our clients first</p>
        </div>

        <section className="flex flex-col gap-4 w-1/2 p-16">
          <p>
            we believe in the power of community and collaboration, which is why
            we're dedicated to bringing innovative ideas to life through our
            platform, where passion meets opportunity.
          </p>
          <p>
            We are not just a platform; we are a community of passionate
            individuals united by a shared belief in Africa's potential. We
            offer:
          </p>
          <p>
            Expert guidance: Our team of experienced professionals assists both
            investors and project developers, providing guidance and support
            throughout the entire process.
          </p>

          <p>
            Vetting process: We meticulously review each project proposal,
            ensuring transparency, feasibility, and impact before it is
            presented to our investor community.
          </p>

          <p>
            Diverse portfolio opportunities: We offer a range of diverse
            projects across various sectors, allowing investors to diversify
            their portfolios and choose projects that align with their values.
          </p>
          <p>Join the movement</p>
          <p>
            More than just a platform, It's a movement. We are building a bridge
            between investors and impactful projects in Africa, fostering
            sustainable growth and creating lasting positive change.
          </p>
        </section>

        <section className="px-6">
          <h2 className="text-3xl w-full font-semibold pl-6">
            Our Core Values
          </h2>
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto py-16 ">
              {values.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 flex flex-col justify-between items-start p-8 hover:-translate-y-1 transition-transform shadow-md rounded-md"
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
        </section>

        <TeamGrid />

        <section className="px-6 py-16">
          <h2 className="text-3xl w-full font-semibold">
            Learn More About Us
          </h2>
            <video
              src="/videos/hero-video.mp4"
              muted
              loop
              playsInline
              controls
              className="w-full h-full object-cover opacity-100 z-0 aspect-video mt-8 rounded-lg"
            />
        </section>
      </div>
    </div>
  );
}
