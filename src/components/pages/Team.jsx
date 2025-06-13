import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { projectService, taskService } from '@/services'

const Team = () => {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ])
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const getAllTeamMembers = () => {
    const members = new Set()
    
    // Add members from projects
    projects.forEach(project => {
      project.members?.forEach(member => members.add(member))
    })
    
    // Add assignees from tasks
    tasks.forEach(task => {
      if (task.assignee) members.add(task.assignee)
    })
    
    return Array.from(members)
  }

  const getMemberStats = (memberName) => {
    const memberTasks = tasks.filter(task => task.assignee === memberName)
    const memberProjects = projects.filter(project => 
      project.members?.includes(memberName)
    )
    
    const completed = memberTasks.filter(task => task.status === 'done').length
    const inProgress = memberTasks.filter(task => task.status === 'in-progress').length
    const overdue = memberTasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length
    
    const completionRate = memberTasks.length > 0 
      ? Math.round((completed / memberTasks.length) * 100) 
      : 0

    return {
      totalTasks: memberTasks.length,
      completed,
      inProgress,
      overdue,
      totalProjects: memberProjects.length,
      completionRate
    }
  }

  const getTeamStats = () => {
    const totalMembers = getAllTeamMembers().length
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'done').length
    const averageCompletion = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0

    return {
      totalMembers,
      totalTasks,
      completedTasks,
      averageCompletion
    }
  }

  const teamMembers = getAllTeamMembers()
  const teamStats = getTeamStats()

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Team Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (teamMembers.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Team</h1>
          <p className="text-gray-600">View team members and their performance</p>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            Team members will appear here once projects are created and tasks are assigned.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Team</h1>
        <p className="text-gray-600">View team members and their performance</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
            </div>
            <ApperIcon name="Users" className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.totalTasks}</p>
            </div>
            <ApperIcon name="CheckSquare" className="w-8 h-8 text-info" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-success">{teamStats.completedTasks}</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
              <p className="text-2xl font-bold text-warning">{teamStats.averageCompletion}%</p>
            </div>
            <ApperIcon name="TrendingUp" className="w-8 h-8 text-warning" />
          </div>
        </motion.div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => {
          const stats = getMemberStats(member)
          
          return (
            <motion.div
              key={member}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              {/* Member Header */}
              <div className="flex items-center space-x-4 mb-4">
                <Avatar name={member} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-gray-900 truncate">
                    {member}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stats.totalProjects} project{stats.totalProjects !== 1 ? 's' : ''}
                  </p>
                </div>
                <Badge 
                  variant={stats.completionRate >= 80 ? 'success' : stats.completionRate >= 60 ? 'warning' : 'error'}
                >
                  {stats.completionRate}%
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                  <p className="text-xs text-gray-600">Total Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  {stats.inProgress > 0 && (
                    <div className="flex items-center text-warning">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                      <span>{stats.inProgress}</span>
                    </div>
                  )}
                  {stats.overdue > 0 && (
                    <div className="flex items-center text-error">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-1" />
                      <span>{stats.overdue}</span>
                    </div>
                  )}
                </div>
                
                {stats.totalTasks === 0 && (
                  <span className="text-gray-500 italic">No tasks assigned</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Team