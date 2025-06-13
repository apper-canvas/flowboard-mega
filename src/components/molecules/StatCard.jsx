import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-500'
            }`}>
              {trend === 'up' && <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />}
              {trend === 'down' && <ApperIcon name="TrendingDown" className="w-4 h-4 mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard