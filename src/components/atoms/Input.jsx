import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label, 
  error, 
  icon, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

  const handleFocus = () => setFocused(true)
  const handleBlur = (e) => {
    setFocused(false)
    setHasValue(!!e.target.value)
  }

  const inputClasses = `
    w-full px-3 pt-6 pb-2 text-sm border rounded-lg transition-all duration-200
    ${error 
      ? 'border-error focus:border-error focus:ring-error' 
      : 'border-gray-300 focus:border-primary focus:ring-primary'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-20
    ${icon ? 'pr-10' : ''}
    ${className}
  `

  const labelClasses = `
    absolute left-3 transition-all duration-200 pointer-events-none text-gray-500
    ${focused || hasValue 
      ? 'top-2 text-xs text-primary' 
      : 'top-1/2 -translate-y-1/2 text-sm'
    }
  `

  return (
    <div className="relative">
      <input
        type={type}
        className={inputClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setHasValue(!!e.target.value)}
        {...props}
      />
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
}

export default Input