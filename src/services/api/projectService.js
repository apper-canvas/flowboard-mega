import projectsData from '../mockData/projects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let projects = [...projectsData]

const projectService = {
  async getAll() {
    await delay(300)
    return [...projects]
  },

  async getById(id) {
    await delay(200)
    const project = projects.find(p => p.id === id)
    if (!project) {
      throw new Error('Project not found')
    }
    return { ...project }
  },

  async create(projectData) {
    await delay(400)
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    projects.push(newProject)
    return { ...newProject }
  },

  async update(id, updates) {
    await delay(300)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    projects[index] = { ...projects[index], ...updates }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay(200)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Project not found')
    }
    projects.splice(index, 1)
    return { success: true }
  }
}

export default projectService