import commentsData from '../mockData/comments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let comments = [...commentsData]

const commentService = {
  async getAll() {
    await delay(300)
    return [...comments]
  },

  async getById(id) {
    await delay(200)
    const comment = comments.find(c => c.id === id)
    if (!comment) {
      throw new Error('Comment not found')
    }
    return { ...comment }
  },

  async getByTaskId(taskId) {
    await delay(250)
    return comments.filter(c => c.taskId === taskId).map(c => ({ ...c }))
  },

  async create(commentData) {
    await delay(300)
    const newComment = {
      ...commentData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    comments.push(newComment)
    return { ...newComment }
  },

  async update(id, updates) {
    await delay(250)
    const index = comments.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    comments[index] = { ...comments[index], ...updates }
    return { ...comments[index] }
  },

  async delete(id) {
    await delay(200)
    const index = comments.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    comments.splice(index, 1)
    return { success: true }
  }
}

export default commentService