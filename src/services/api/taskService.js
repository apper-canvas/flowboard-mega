import tasksData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...tasksData]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async getByProjectId(projectId) {
    await delay(250)
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }))
  },

  async getByAssignee(assignee) {
    await delay(250)
    return tasks.filter(t => t.assignee === assignee).map(t => ({ ...t }))
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      progress: 0,
      comments: [],
      attachments: []
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(300)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks[index] = { ...tasks[index], ...updates }
    return { ...tasks[index] }
  },

  async updateStatus(id, status) {
    await delay(200)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks[index] = { ...tasks[index], status }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    tasks.splice(index, 1)
    return { success: true }
  }
}

export default taskService