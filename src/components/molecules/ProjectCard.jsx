import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const ProjectCard = ({ project, taskStats = { total: 0, completed: 0, overdue: 0 } }) => {
  const navigate = useNavigate()
  
  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0

  const statusColors = {
    active: 'success',
    planning: 'warning',
    completed: 'info',
    on_hold: 'error'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 text-lg mb-2 break-words">
            {project.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed break-words">
            {project.description}
          </p>
        </div>
        <Badge variant={statusColors[project.status]} className="ml-4 flex-shrink-0">
          {project.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <ApperIcon name="CheckSquare" className="w-4 h-4 mr-1" />
            <span>{taskStats.total} tasks</span>
          </div>
          {taskStats.overdue > 0 && (
            <div className="flex items-center text-error">
              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
              <span>{taskStats.overdue} overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Team Members */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Team:</span>
          <div className="flex -space-x-2">
            {project.members?.slice(0, 4).map((member, index) => (
              <Avatar
                key={index}
                name={member}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {project.members?.length > 4 && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +{project.members.length - 4}
              </div>
            )}
          </div>
        </div>
        
        <motion.div
          whileHover={{ x: 4 }}
          className="text-primary"
        >
          <ApperIcon name="ArrowRight" className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProjectCard