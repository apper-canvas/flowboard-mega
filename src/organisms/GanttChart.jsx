import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import milestoneService from '@/services/api/milestoneService';
import taskDependencyService from '@/services/api/taskDependencyService';

const GanttChart = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragType, setDragType] = useState(null); // 'move' or 'resize'
  const ganttRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, milestonesData, dependenciesData] = await Promise.all([
        taskService.getByProjectId(projectId),
        milestoneService.getByProjectId(projectId),
        taskDependencyService.getAll()
      ]);

      setTasks(tasksData);
      setMilestones(milestonesData);
      setDependencies(dependenciesData);
    } catch (err) {
      console.error('Error loading Gantt data:', err);
      setError('Failed to load project data');
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        start: startOfMonth(today),
        end: endOfMonth(addDays(today, 30))
      };
    }

    const dates = tasks
      .filter(task => task.due_date)
      .map(task => parseISO(task.due_date));

    if (dates.length === 0) {
      const today = new Date();
      return {
        start: startOfMonth(today),
        end: endOfMonth(addDays(today, 30))
      };
    }

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return {
      start: startOfMonth(addDays(minDate, -7)),
      end: endOfMonth(addDays(maxDate, 7))
    };
  };

  const dateRange = getDateRange();
  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  const dayWidth = 40;

  const getTaskPosition = (task) => {
    if (!task.due_date) return { left: 0, width: dayWidth };
    
    const taskDate = parseISO(task.due_date);
    const dayIndex = days.findIndex(day => 
      format(day, 'yyyy-MM-dd') === format(taskDate, 'yyyy-MM-dd')
    );
    
    const left = dayIndex >= 0 ? dayIndex * dayWidth : 0;
    const width = Math.max(dayWidth * 2, dayWidth); // Minimum 2 days width
    
    return { left, width };
  };

  const getMilestonePosition = (milestone) => {
    if (!milestone.dueDate) return 0;
    
    const milestoneDate = parseISO(milestone.dueDate);
    const dayIndex = days.findIndex(day => 
      format(day, 'yyyy-MM-dd') === format(milestoneDate, 'yyyy-MM-dd')
    );
    
    return dayIndex >= 0 ? dayIndex * dayWidth : 0;
  };

  const handleMouseDown = (e, task, type) => {
    e.preventDefault();
    setDraggedTask(task);
    setDragType(type);
    
    const handleMouseMove = (e) => {
      if (!draggedTask) return;
      
      const rect = ganttRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const dayIndex = Math.floor(x / dayWidth);
      
      if (dayIndex >= 0 && dayIndex < days.length) {
        const newDate = days[dayIndex];
        const newDateString = format(newDate, 'yyyy-MM-dd');
        
        setTasks(prev => prev.map(t => 
          t.id === draggedTask.id 
            ? { ...t, due_date: newDateString }
            : t
        ));
      }
    };
    
    const handleMouseUp = async () => {
      if (draggedTask) {
        try {
          const updatedTask = tasks.find(t => t.id === draggedTask.id);
          if (updatedTask) {
            await taskService.update(draggedTask.id, {
              title: updatedTask.title,
              description: updatedTask.description,
              assignee: updatedTask.assignee,
              status: updatedTask.status,
              priority: updatedTask.priority,
              dueDate: updatedTask.due_date,
              progress: updatedTask.progress,
              projectId: updatedTask.projectId
            });
            toast.success('Task updated successfully');
          }
        } catch (error) {
          console.error('Error updating task:', error);
          toast.error('Failed to update task');
          loadData(); // Reload to revert changes
        }
      }
      
      setDraggedTask(null);
      setDragType(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusOpacity = (status) => {
    switch (status) {
      case 'done': return 'opacity-60';
      case 'in-progress': return 'opacity-80';
      default: return 'opacity-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Gantt Chart</h3>
        <p className="text-sm text-gray-600">{tasks.length} tasks, {milestones.length} milestones</p>
      </div>
      
      <div className="overflow-x-auto" ref={ganttRef}>
        <div style={{ minWidth: days.length * dayWidth + 300 }}>
          {/* Header */}
          <div className="flex border-b border-gray-200">
            <div className="w-72 p-3 bg-gray-50 border-r border-gray-200 font-medium text-gray-900">
              Task
            </div>
            <div className="flex">
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className="border-r border-gray-100 bg-gray-50 p-2 text-center text-xs"
                  style={{ width: dayWidth }}
                >
                  <div className="font-medium text-gray-900">{format(day, 'MMM')}</div>
                  <div className="text-gray-600">{format(day, 'd')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          {tasks.map((task, taskIndex) => {
            const position = getTaskPosition(task);
            return (
              <div key={task.id} className="flex border-b border-gray-100 hover:bg-gray-50">
                <div className="w-72 p-3 border-r border-gray-200">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {task.title || task.Name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {task.assignee}
                  </div>
                </div>
                <div 
                  className="relative flex-1" 
                  style={{ height: '60px', minWidth: days.length * dayWidth }}
                >
                  {/* Task Bar */}
                  <div
                    className={`absolute top-2 h-8 rounded cursor-move transition-all duration-200 hover:shadow-md ${getPriorityColor(task.priority)} ${getStatusOpacity(task.status)}`}
                    style={{
                      left: position.left,
                      width: position.width,
                      zIndex: draggedTask?.id === task.id ? 10 : 1
                    }}
                    onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                  >
                    <div className="flex items-center h-full px-2 text-white text-xs font-medium">
                      <span className="truncate">{task.title || task.Name}</span>
                    </div>
                    
                    {/* Resize Handle */}
                    <div
                      className="absolute right-0 top-0 w-2 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-white bg-opacity-30"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, task, 'resize');
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="flex border-b border-gray-100 bg-yellow-50">
              <div className="w-72 p-3 border-r border-gray-200">
                <div className="font-medium text-gray-900 text-sm">Milestones</div>
              </div>
              <div 
                className="relative flex-1" 
                style={{ height: '40px', minWidth: days.length * dayWidth }}
              >
                {milestones.map(milestone => {
                  const position = getMilestonePosition(milestone);
                  return (
                    <div
                      key={milestone.Id}
                      className="absolute top-2 transform -translate-x-1/2"
                      style={{ left: position }}
                    >
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-yellow-500" />
                      <div className="text-xs text-yellow-700 font-medium mt-1 whitespace-nowrap">
                        {milestone.Name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;