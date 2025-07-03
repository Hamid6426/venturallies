import { MdHelpCenter, MdWork } from "react-icons/md";
import { Link } from "react-router-dom";
import heroVideo from "./../../assets/videos/hero-video.mp4"

export default function CallToAction() {
  return (
    <div className="relative flex flex-col justify-center items-center space-y-6 text-center py-52 px-6 overflow-hidden">
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-100 z-0 aspect-video"
      />
      <div className="absolute top-0 left-0 bg-green-900/80 w-full h-full object-cover  z-10 aspect-video"></div>

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
    </div>
  );
}
