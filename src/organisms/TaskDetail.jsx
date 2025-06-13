import React, { useState, useEffect } from 'react';
import { X, Calendar, User, AlertCircle, Paperclip } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import taskService from '@/services/api/taskService';
import FileUpload from '@/organisms/FileUpload';
import AttachmentList from '@/molecules/AttachmentList';

const TaskDetail = ({ task, isOpen, onClose, onUpdate }) => {
  const [taskData, setTaskData] = useState(task);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.updateStatus(task.id, newStatus);
      setTaskData(updatedTask);
      onUpdate(updatedTask);
      toast.success('Task status updated successfully');
    } catch (error) {
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentUploaded = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('File attached successfully');
  };

  const handleAttachmentDeleted = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Attachment removed successfully');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'text-gray-600 bg-gray-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'done': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{taskData.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{taskData.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Assigned to:</span>
                  <span className="text-sm font-medium text-gray-900">{taskData.assignee}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Due:</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(taskData.dueDate), 'MMM d, yyyy')}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Priority:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(taskData.priority)}`}>
                    {taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={taskData.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">{taskData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${taskData.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Paperclip className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
            </div>
            
            <div className="space-y-4">
              <FileUpload taskId={taskData.id} onUploadComplete={handleAttachmentUploaded} />
              <AttachmentList 
                taskId={taskData.id} 
                onAttachmentDeleted={handleAttachmentDeleted}
                key={refreshKey}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;