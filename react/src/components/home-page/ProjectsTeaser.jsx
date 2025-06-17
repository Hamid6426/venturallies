import React from "react";
import { Link } from "react-router-dom";

// Sample project data
const projects = [
  {
    id: 1,
    title: "Solar Energy Farm",
    description: "Invest in a clean energy project powering 500+ homes.",
    expectedReturn: "7.5%",
    termPeriod: "24 months",
    timeLeft: "5 days",
    invested: 60, // percent
    minimumGoal: 20, // percent
    image: "/solar.jpg",
  },
  {
    id: 2,
    title: "Smart Housing Units",
    description: "Modern housing with green tech in suburban areas.",
    expectedReturn: "6.2%",
    termPeriod: "18 months",
    timeLeft: "2 days",
    invested: 45,
    minimumGoal: 25,
    image: "/housing.jpg",
  },
  {
    id: 3,
    title: "Agricultural Robotics",
    description: "Next-gen robotic equipment for efficient farming.",
    expectedReturn: "8.0%",
    termPeriod: "12 months",
    timeLeft: "7 days",
    invested: 30,
    minimumGoal: 15,
    image: "/agri.jpg",
  },
];

export default function ProjectsTeaser() {
  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full pb-32 px-6">
      <div className="text-2xl font-bold pb-8">New Projects</div>

      {projects.map((project) => {
        const remaining = 100 - (project.invested + project.minimumGoal);

        return (
          <div
            key={project.id}
            className="grid grid-cols-1 md:grid-cols-2 w-full h-full mb-12 border border-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={project.image}
              alt={project.title}
              className="border-r border-gray-200 object-cover w-full h-64 md:h-full"
            />
            <div className="p-8 w-full h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
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
                      <td>{project.expectedReturn}</td>
                      <td>{project.termPeriod}</td>
                      <td>{project.timeLeft}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Progress Bar */}
                <div className="flex h-4 w-full rounded-full overflow-hidden mb-6">
                  <div
                    className="bg-green-500"
                    style={{ width: `${project.invested}%` }}
                  />
                  <div
                    className="bg-yellow-200"
                    style={{ width: `${project.minimumGoal}%` }}
                  />
                  <div
                    className="bg-gray-300"
                    style={{ width: `${remaining}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="w-full text-center py-4 bg-green-500 hover:-translate-y-1 transition-all text-white font-bold rounded"
              >
                DETAILS
              </Link>
            </div>
          </div>
        );
      })}

      <Link
        to="/projects"
        className="w-full py-4 bg-gray-800 mt-12 hover:-translate-y-1 transition-all text-white text-center font-bold rounded"
      >
        BROWSE MORE PROJECTS
      </Link>
    </div>
  );
}
