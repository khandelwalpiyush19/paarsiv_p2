import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const statusColors = {
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  const statusClass = statusColors[project.status] || statusColors.default;

  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Manager:</span> {project.projectLeader?.name || 'Not assigned'}
      </p>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-600">Status:</span>
        <span className={`text-xs px-2 py-1 rounded-full ml-2 ${statusClass}`}>
          {project.status}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;