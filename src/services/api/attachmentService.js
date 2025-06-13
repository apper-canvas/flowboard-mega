import attachmentsData from '../mockData/attachments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let attachments = [...attachmentsData]

const attachmentService = {
  async getAll() {
    await delay(300)
    return [...attachments]
  },

  async getById(id) {
    await delay(200)
    const attachment = attachments.find(a => a.id === id)
    if (!attachment) {
      throw new Error('Attachment not found')
    }
    return { ...attachment }
  },

  async getByTaskId(taskId) {
    await delay(250)
    return attachments.filter(a => a.taskId === taskId).map(a => ({ ...a }))
  },

  async create(attachmentData) {
    await delay(400)
    const newAttachment = {
      ...attachmentData,
      id: Date.now().toString()
    }
    attachments.push(newAttachment)
    return { ...newAttachment }
  },

  async delete(id) {
    await delay(200)
    const index = attachments.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Attachment not found')
    }
    attachments.splice(index, 1)
    return { success: true }
  }
}

export default attachmentService