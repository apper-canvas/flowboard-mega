import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Avatar from '@/components/atoms/Avatar'
import KanbanColumn from '@/components/molecules/KanbanColumn'
import TaskDetailModal from '@/components/organisms/TaskDetailModal'
import CreateTaskModal from '@/components/organisms/CreateTaskModal'
import ApperIcon from '@/components/ApperIcon'
import { projectService, taskService } from '@/services'

const ProjectBoard = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [filters, setFilters] = useState({
    assignee: 'all',
    priority: 'all'
  })

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'done', title: 'Done', status: 'done' }
  ]

  useEffect(() => {
    loadData()
  }, [projectId])

  useEffect(() => {
    applyFilters()
  }, [tasks, filters])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProjectId(projectId)
      ])
      setProject(projectData)
      setTasks(tasksData)
    } catch (err) {
      setError(err.message || 'Failed to load project')
      toast.error('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...tasks]
    
    if (filters.assignee !== 'all') {
      filtered = filtered.filter(task => task.assignee === filters.assignee)
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }
    
    setFilteredTasks(filtered)
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    setSelectedTask(updatedTask)
  }

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    
    const taskId = e.dataTransfer.getData('text/plain')
    const task = tasks.find(t => t.id === taskId)
    
    if (!task || task.status === targetStatus) return

    try {
      const updatedTask = await taskService.updateStatus(taskId, targetStatus)
      setTasks(prev => prev.map(t => 
        t.id === taskId ? updatedTask : t
      ))
      toast.success('Task moved successfully')
    } catch (error) {
      toast.error('Failed to move task')
    }
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const getAllAssignees = () => {
    const uniqueAssignees = [...new Set(tasks.map(task => task.assignee))]
    return uniqueAssignees.filter(Boolean)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-96"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-96">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Project</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button onClick={loadData} icon="RefreshCw">
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/')}
          />
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 5).map((member, index) => (
              <Avatar
                key={index}
                name={member}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {project.members?.length > 5 && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +{project.members.length - 5}
              </div>
            )}
          </div>
          <Button
            icon="Plus"
            onClick={() => setShowCreateModal(true)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.assignee}
          onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
        >
          <option value="all">All Assignees</option>
          {getAllAssignees().map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>

        <select
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {(filters.assignee !== 'all' || filters.priority !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={() => setFilters({ assignee: 'all', priority: 'all' })}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            tasks={getTasksByStatus(column.status)}
            onTaskClick={handleTaskClick}
            onDrop={(e) => handleDrop(e, column.status)}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            isDragOver={dragOverColumn === column.id}
          />
        ))}
      </div>

      {/* Modals */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setSelectedTask(null)
        }}
        onUpdate={handleTaskUpdate}
      />

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleTaskCreated}
        projectId={projectId}
        projectMembers={project.members || []}
      />
    </div>
  )
}

export default ProjectBoard