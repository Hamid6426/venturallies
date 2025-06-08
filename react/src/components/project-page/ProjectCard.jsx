import Tooltip from "./Tooltip";

function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <img
        src={project.project_photo}
        alt={project.project_title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3>{project.project_title}</h3>
        <p>{project.project_short_description}</p>
        <div className="flex space-x-2 text-sm mt-2">
          <div>
            <strong>€{project.project_target}</strong>
            <br />
            Target
          </div>
          <div>
            <strong>{project.project_expected_return}%</strong>
            <br />
            Return
          </div>
          <div>
            <strong>{project.project_term} mo</strong>
            <br />
            Term
          </div>
          <div>
            <strong>{project.project_to_invest} days</strong>
            <br />
            To invest
          </div>
          <Tooltip
            message={
              project.convertible === "yes"
                ? "Convertible: investors can convert into equity…"
                : "Non‑convertible: no equity conversion."
            }
          >
            <span className="text-gray-500">
              <i className="fas fa-info-circle" />
            </span>
          </Tooltip>
        </div>
        <div className="mt-4 bg-gray-200 h-4 rounded overflow-hidden">
          <div
            className="bg-blue-500 h-full"
            style={{
              width: `${
                (project.current_invested / project.project_target) * 100
              }%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>€{project.current_invested} invested</span>
          <span>€{project.project_target - project.current_invested} left</span>
        </div>
        <a
          href={`/single-project/${project.project_id}`}
          className="block text-center bg-green-600 text-white py-2 mt-4 rounded"
        >
          Details
        </a>
      </div>
    </div>
  );
}

export default ProjectCard;
