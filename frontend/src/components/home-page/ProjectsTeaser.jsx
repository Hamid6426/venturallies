import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdInfoOutline } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import placeHolder from "./../../assets/logos/logo.png";

export default function ProjectsTeaser() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      const cached = localStorage.getItem("teaserProjectsCache");
      const cachedTime = localStorage.getItem("teaserProjectsCacheTime");
      const cacheValidFor = 5 * 60 * 1000; // 5 minutes

      if (
        cached &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < cacheValidFor
      ) {
        setProjects(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(
          "/ventures?limit=3&sortBy=createdAt&order=desc"
        );
        const freshData = res.data.data || [];
        setProjects(freshData);
        localStorage.setItem("teaserProjectsCache", JSON.stringify(freshData));
        localStorage.setItem("teaserProjectsCacheTime", Date.now().toString());
      } catch (err) {
        console.error("Failed to load ventures for teaser:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full pb-32 px-6">
      <div className="text-2xl font-bold pb-8">New Projects</div>

      {loading ? (
        <p className="text-center text-gray-600 py-12">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No new projects available.
        </p>
      ) : (
        projects.map((project) => {
          const target = project.targetAmount || 0;
          const invested = project.amountFunded || 0;
          const progress = target > 0 ? (invested / target) * 100 : 0;
          const minimumGoal = 20;
          const remaining = Math.max(0, 100 - (progress + minimumGoal));
          const daysLeft = Math.max(
            0,
            Math.ceil(
              (new Date(project.closingDate) - new Date()) /
                (1000 * 60 * 60 * 24)
            )
          );

          return (
            <div
              key={project._id}
              className="flex flex-col lg:flex-row w-full h-full mb-12 border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={
                  project.images?.[0]
                    ? `${import.meta.env.VITE_BACKEND_URL}${project.images[0]}`
                    : placeHolder
                }
                alt={project.title}
                className="border-r border-gray-200 object-cover w-full lg:w-5/12 aspect-video"
              />
              <div className="p-8 w-full lg:w-7/12 h-full flex flex-col justify-between items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>
                    <div className="relative flex items-center text-sm text-gray-600">
                      <MdInfoOutline className="mr-1" />
                      {project.isConvertible
                        ? "Convertible"
                        : "Non-Convertible"}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {project.shortDescription}
                  </p>

                  <table className="w-full text-left mb-4">
                    <thead>
                      <tr className="text-sm text-gray-600">
                        <th className="pb-1">Expected Return</th>
                        <th className="pb-1">Term Period</th>
                        <th className="pb-1">Time Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-md font-medium">
                        <td>{project.expectedReturn}%</td>
                        <td>{project.investmentPeriod} months</td>
                        <td>{daysLeft} days</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Progress Bar */}
                  <div className="flex h-4 w-full rounded-full overflow-hidden mb-6">
                    <div
                      className="bg-green-500"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="bg-yellow-200"
                      style={{ width: `${minimumGoal}%` }}
                    />
                    <div
                      className="bg-gray-300"
                      style={{ width: `${remaining}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/projects/${project._id}`}
                  className="w-full text-center py-4 bg-green-500 hover:-translate-y-1 transition-all text-white font-bold rounded"
                >
                  DETAILS
                </Link>
              </div>
            </div>
          );
        })
      )}

      <div className="mx-auto">
        <Link
          to="/projects"
          className="w-full py-4 px-8 bg-gray-800 mt-12 hover:-translate-y-1 transition-all text-white text-center font-bold rounded"
        >
          BROWSE MORE PROJECTS
        </Link>
      </div>
    </div>
  );
}
