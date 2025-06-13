import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from './TaskCard'
import ApperIcon from '@/components/ApperIcon'

const KanbanColumn = ({ title, tasks, onTaskClick, onDrop, onDragOver, onDragLeave, isDragOver }) => {
  const statusIcons = {
    'To Do': 'Circle',
    'In Progress': 'Clock',
    'Done': 'CheckCircle'
  }

  const statusColors = {
    'To Do': 'text-gray-500',
    'In Progress': 'text-warning',
    'Done': 'text-success'
  }

  return (
    <div 
      className={`flex flex-col h-full bg-surface rounded-lg p-4 transition-all duration-200 ${
        isDragOver ? 'bg-primary/5 border-2 border-primary border-dashed' : 'border border-gray-200'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon 
            name={statusIcons[title]} 
            className={`w-5 h-5 ${statusColors[title]}`} 
          />
          <h3 className="font-display font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', task.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
            >
              <TaskCard 
                task={task} 
                onClick={() => onTaskClick(task)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <ApperIcon name="Plus" className="w-8 h-8 mb-2" />
            <p className="text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default KanbanColumn