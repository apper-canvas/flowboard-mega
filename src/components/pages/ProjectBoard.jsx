import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectBoard = () => {
  const { projectId } = useParams();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
        <p className="text-gray-600 mt-1">Kanban board for project: {projectId}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
            To Do
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No tasks yet</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
            In Progress
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No tasks yet</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            Done
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">No tasks yet</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Kanban Board</h2>
          <p className="text-gray-500">Project board functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;