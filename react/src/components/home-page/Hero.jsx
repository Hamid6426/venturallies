import React from "react";
import { Link } from "react-router-dom";
import { MdPlayCircle } from "react-icons/md";
export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center w-full aspect-auto py-32 px-6">
      <div className="flex flex-col gap-1 md:gap-4 justify-center items-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-center">
          Leading business
        </h1>
        <h2 className="text-4xl lg:text-5xl font-bold text-center">
          crowdfunding platform
        </h2>
        <p className="text-lg my-4 text-center">
          Invest and earn passive income starting today!
        </p>
        <div className="flex flex-col gap-4 md:flex-row justify-center items-center">
          <a
            target="_blank"
            href="https://www.youtube.com/embed/UBufeh1yv2c?autoplay="
            className=" hover:-translate-y-1 bg-green-500 py-4 px-6 text-white text-bold flex items-center gap-3 text-lg font-bold"
          >
            <MdPlayCircle className="" />
            WATCH OUR VIDEO
          </a>
          <p>
            Want to start?{" "}
            <Link to="projects" className="text-green-600 hover:bg-amber-50">
              Invest Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
