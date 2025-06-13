import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ProgressBar from '@/components/atoms/ProgressBar'
import ApperIcon from '@/components/ApperIcon'
import { taskService, commentService } from '@/services'

const TaskDetailModal = ({ task, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setEditedTask(task)
      loadComments()
    }
  }, [task])

  const loadComments = async () => {
    if (!task?.id) return
    
    setCommentsLoading(true)
    try {
      const taskComments = await commentService.getByTaskId(task.id)
      setComments(taskComments)
    } catch (error) {
      toast.error('Failed to load comments')
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedTask = await taskService.update(task.id, editedTask)
      onUpdate(updatedTask)
      setIsEditing(false)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const comment = await commentService.create({
        taskId: task.id,
        author: 'Current User',
        content: newComment.trim()
      })
      setComments(prev => [...prev, comment])
      setNewComment('')
      toast.success('Comment added')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ]

  if (!isOpen || !task) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={priorityColors[task.priority]} size="sm">
                {task.priority} priority
              </Badge>
              {task.dueDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                  Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(90vh-8rem)]">
            {/* Title and Description */}
            <div className="space-y-4">
              {isEditing ? (
                <Input
                  label="Task Title"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                />
              ) : (
                <h1 className="text-2xl font-display font-bold text-gray-900 break-words">
                  {task.title}
                </h1>
              )}

              {isEditing ? (
                <div className="relative">
                  <textarea
                    className="w-full px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    rows={4}
                    value={editedTask.description}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <label className="absolute left-3 top-2 text-xs text-primary">
                    Description
                  </label>
                </div>
              ) : (
                task.description && (
                  <p className="text-gray-600 leading-relaxed break-words">{task.description}</p>
                )
              )}
            </div>

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned to</label>
                  <div className="flex items-center space-x-2">
                    <Avatar name={task.assignee} size="sm" />
                    <span className="text-sm text-gray-900">{task.assignee}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  {isEditing ? (
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={editedTask.status}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, status: e.target.value }))}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant="info">
                      {statusOptions.find(s => s.value === task.status)?.label || task.status}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedTask.progress}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                      label="Progress (%)"
                    />
                  ) : (
                    <ProgressBar value={task.progress} />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  {isEditing ? (
                    <Input
                      type="datetime-local"
                      value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                      label="Due Date"
                    />
                  ) : (
                    task.dueDate && (
                      <p className="text-sm text-gray-600">
                        {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Attachments */}
            {task.attachments?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <ApperIcon name="Paperclip" className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(attachment.size / 1024)} KB • {attachment.uploadedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Comments</h3>
              
              {commentsLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar name={comment.author} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No comments yet</p>
                  )}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex space-x-3">
                <Avatar name="Current User" size="sm" />
                <div className="flex-1 space-y-2">
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={2}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false)
                  setEditedTask(task)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
              >
                Save Changes
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TaskDetailModal