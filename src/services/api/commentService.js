import { toast } from 'react-toastify';

const commentService = {
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
          { "Field": { "Name": "task_id" } },
          { "Field": { "Name": "author" } },
          { "Field": { "Name": "content" } },
          { "Field": { "Name": "timestamp" } }
        ]
      };

      const response = await apperClient.fetchRecords("Comment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(comment => ({
        ...comment,
        id: comment.Id,
        taskId: comment.task_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching comments:", error);
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
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "task_id", "author", "content", "timestamp"]
      };

      const response = await apperClient.getRecordById("Comment1", id, params);

      if (!response || !response.data) {
        throw new Error('Comment not found');
      }

      // Transform data to match UI expectations
      const comment = response.data;
      return {
        ...comment,
        id: comment.Id,
        taskId: comment.task_id
      };
    } catch (error) {
      console.error(`Error fetching comment with ID ${id}:`, error);
      throw error;
    }
  },

  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "task_id" } },
          { "Field": { "Name": "author" } },
          { "Field": { "Name": "content" } },
          { "Field": { "Name": "timestamp" } }
        ],
        "where": [
          {
            "FieldName": "task_id",
            "Operator": "ExactMatch",
            "Values": [taskId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords("Comment1", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(comment => ({
        ...comment,
        id: comment.Id,
        taskId: comment.task_id
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching comments by task:", error);
      return [];
    }
  },

  async create(commentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Comment by ${commentData.author}`,
          Tags: "",
          Owner: commentData.author,
          task_id: parseInt(commentData.taskId),
          author: commentData.author,
          content: commentData.content,
          timestamp: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("Comment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comments:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const comment = successfulRecords[0].data;
          return {
            ...comment,
            id: comment.Id,
            taskId: comment.task_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating comment:", error);
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
          Name: updates.name,
          Tags: updates.tags,
          Owner: updates.author,
          task_id: updates.taskId ? parseInt(updates.taskId) : undefined,
          author: updates.author,
          content: updates.content,
          timestamp: updates.timestamp
        }]
      };

      const response = await apperClient.updateRecord("Comment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} comments:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const comment = successfulUpdates[0].data;
          return {
            ...comment,
            id: comment.Id,
            taskId: comment.task_id
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating comment:", error);
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

      const response = await apperClient.deleteRecord("Comment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} comments:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
};

export default commentService;