import React from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import useGetAllProjects from '../../Hooks/useGetAllProjects';

const ProjectsPage = () => {
  useGetAllProjects();
  const { allProjects, loading, error } = useSelector(store => store.project);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      
      {loading && <div className="text-center py-8">Loading projects...</div>}
      {error && <div className="bg-red-100 p-4 rounded mb-6">Error: {error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects?.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {!loading && !error && allProjects?.length === 0 && (
        <div className="bg-blue-50 p-4 rounded">No projects found</div>
      )}
    </div>
  );
};

export default ProjectsPage;