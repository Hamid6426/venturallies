// ProjectsPage.jsx
import { useState, useEffect } from "react";
import ProjectCard from "../components/project-page/ProjectCard";
import Filters from "../components/project-page/Filters";

export default function ProjectsPage() {
  const [filters, setFilters] = useState({
    status: "all",
    min_return: "",
    max_return: "",
    country: "all",
    type: "",
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const qs = new URLSearchParams(filters).toString();
    fetch(`/api/projects?${qs}`)
      .then((res) => res.json())
      .then(setProjects);
  }, [filters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setFilters(Object.fromEntries(form));
  };

  const reset = () =>
    setFilters({
      status: "all",
      min_return: "",
      max_return: "",
      country: "all",
      type: "",
    });

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-center items-center py-20 bg-gray-100 gap-6">
        {/* <img src="sample-header.jpg" alt="header-image" className="absolute opacity-40"/> */}
        <h2 className="text-4xl w-full font-semibold text-center ">
          Projects
        </h2>
        <hr className="w-16 bg-gray-600"></hr>
        <p className="text-xl font-light">WE MAKE INVESTMENT IN LOANS EASY</p>
      </div>

      <div className="px-4 mt-6">
        <Filters
          filters={filters}
          setFilters={setFilters}
          onSubmit={handleSubmit}
          onReset={reset}
        />
        <div className="grid gap-4 mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.project_id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
