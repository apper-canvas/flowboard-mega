import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/atoms/ProgressBar'
import ApperIcon from '@/components/ApperIcon'

const TaskCard = ({ task, onClick, isDragging = false }) => {
  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDragging ? 'rotate-3 scale-105 shadow-lg' : ''
      } ${isOverdue ? 'border-l-4 border-l-error' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 break-words">
          {task.title}
        </h3>
        <Badge variant={priorityColors[task.priority]} size="xs" className="ml-2 flex-shrink-0">
          {task.priority}
        </Badge>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 break-words">
          {task.description}
        </p>
      )}

      {task.progress > 0 && (
        <div className="mb-3">
          <ProgressBar value={task.progress} showLabel={false} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar name={task.assignee} size="xs" />
          <span className="text-xs text-gray-600 truncate max-w-20">
            {task.assignee?.split(' ')[0]}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {task.comments?.length > 0 && (
            <div className="flex items-center">
              <ApperIcon name="MessageCircle" className="w-3 h-3 mr-1" />
              <span>{task.comments.length}</span>
            </div>
          )}
          {task.attachments?.length > 0 && (
            <div className="flex items-center">
              <ApperIcon name="Paperclip" className="w-3 h-3 mr-1" />
              <span>{task.attachments.length}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={`flex items-center ${isOverdue ? 'text-error' : ''}`}>
              <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard