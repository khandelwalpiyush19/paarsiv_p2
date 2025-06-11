import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const project = useSelector(store => 
    store.project?.allProjects?.find(p => p._id === id)
  );

  if (!project) {
    return <div className="p-8 text-center">Project not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <div className="space-y-3">
            <p><span className="font-medium">Status:</span> {project.status}</p>
            <p><span className="font-medium">Manager:</span> {project.projectLeader?.name || 'Not assigned'}</p>
            <p><span className="font-medium">Start Date:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
            {project.deadline && (
              <p><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
            )}
            {project.budget && (
              <p><span className="font-medium">Budget:</span> ${project.budget}</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          {project.projectMembers?.length > 0 ? (
            <ul className="space-y-2">
              {project.projectMembers.map((member, index) => (
                <li key={index} className="border-b pb-2 last:border-0">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-gray-600">{member.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members assigned</p>
          )}
        </div>
      </div>

      {project.description && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{project.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;