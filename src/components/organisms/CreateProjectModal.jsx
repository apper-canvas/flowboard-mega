import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { projectService } from '@/services'

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: []
  })
  const [newMember, setNewMember] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    setLoading(true)
    try {
      const project = await projectService.create(formData)
      onSuccess(project)
      onClose()
      setFormData({ name: '', description: '', members: [] })
      toast.success('Project created successfully')
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const addMember = () => {
    if (newMember.trim() && !formData.members.includes(newMember.trim())) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, newMember.trim()]
      }))
      setNewMember('')
    }
  }

  const removeMember = (member) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== member)
    }))
  }

  if (!isOpen) return null

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
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">Create New Project</h2>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Project Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <div className="relative">
              <textarea
                className="w-full px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <label className="absolute left-3 top-2 text-xs text-primary">
                Description
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="Enter member name"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                />
                <Button
                  type="button"
                  size="sm"
                  icon="Plus"
                  onClick={addMember}
                  disabled={!newMember.trim()}
                >
                  Add
                </Button>
              </div>
              
              {formData.members.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.members.map((member) => (
                    <div
                      key={member}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <span>{member}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(member)}
                        className="ml-2 text-gray-500 hover:text-error"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
              >
                Create Project
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreateProjectModal