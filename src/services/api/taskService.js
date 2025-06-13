import { toast } from 'react-toastify';

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "Tags" } },
          { "Field": { "Name": "Owner" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "CreatedBy" } },
          { "Field": { "Name": "ModifiedOn" } },
          { "Field": { "Name": "ModifiedBy" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "assignee" } },
          { "Field": { "Name": "status" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "progress" } },
          { "Field": { "Name": "project_id" } }
        ]
      };

      const response = await apperClient.fetchRecords("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(task => ({
        ...task,
        id: task.Id,
        dueDate: task.due_date,
        projectId: task.project_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "title", "description", "assignee", "status", "priority", "due_date", "progress", "project_id"]
      };

      const response = await apperClient.getRecordById("task", id, params);

      if (!response || !response.data) {
        throw new Error('Task not found');
      }

      // Transform data to match UI expectations
      const task = response.data;
      return {
        ...task,
        id: task.Id,
        dueDate: task.due_date,
        projectId: task.project_id
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async getByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "assignee" } },
          { "Field": { "Name": "status" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "progress" } },
          { "Field": { "Name": "project_id" } }
        ],
        "where": [
          {
            "FieldName": "project_id",
            "Operator": "ExactMatch",
            "Values": [projectId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords("task", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(task => ({
        ...task,
        id: task.Id,
        dueDate: task.due_date,
        projectId: task.project_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      return [];
    }
  },

  async getByAssignee(assignee) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "assignee" } },
          { "Field": { "Name": "status" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "progress" } },
          { "Field": { "Name": "project_id" } }
        ],
        "where": [
          {
            "FieldName": "assignee",
            "Operator": "ExactMatch",
            "Values": [assignee]
          }
        ]
      };

      const response = await apperClient.fetchRecords("task", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(task => ({
        ...task,
        id: task.Id,
        dueDate: task.due_date,
        projectId: task.project_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching tasks by assignee:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: taskData.title,
          Tags: taskData.tags || "",
          Owner: taskData.assignee,
          title: taskData.title,
          description: taskData.description,
          assignee: taskData.assignee,
          status: taskData.status || "todo",
          priority: taskData.priority || "medium",
          due_date: taskData.dueDate,
          progress: taskData.progress || 0,
          project_id: parseInt(taskData.projectId)
        }]
      };

      const response = await apperClient.createRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            ...task,
            id: task.Id,
            dueDate: task.due_date,
            projectId: task.project_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updates.title,
          Tags: updates.tags,
          Owner: updates.assignee,
          title: updates.title,
          description: updates.description,
          assignee: updates.assignee,
          status: updates.status,
          priority: updates.priority,
          due_date: updates.dueDate,
          progress: updates.progress,
          project_id: updates.projectId ? parseInt(updates.projectId) : undefined
        }]
      };

      const response = await apperClient.updateRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            ...task,
            id: task.Id,
            dueDate: task.due_date,
            projectId: task.project_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          status: status
        }]
      };

      const response = await apperClient.updateRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            ...task,
            id: task.Id,
            dueDate: task.due_date,
            projectId: task.project_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("task", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default taskService;