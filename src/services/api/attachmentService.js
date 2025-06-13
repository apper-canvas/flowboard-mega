import { toast } from 'react-toastify';

const attachmentService = {
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
          { "Field": { "Name": "size" } },
          { "Field": { "Name": "type" } },
          { "Field": { "Name": "uploaded_by" } }
        ]
      };

      const response = await apperClient.fetchRecords("Attachment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(attachment => ({
        ...attachment,
        id: attachment.Id,
        name: attachment.Name,
        taskId: attachment.task_id,
        uploadedBy: attachment.uploaded_by
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching attachments:", error);
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
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "task_id", "size", "type", "uploaded_by"]
      };

      const response = await apperClient.getRecordById("Attachment1", id, params);

      if (!response || !response.data) {
        throw new Error('Attachment not found');
      }

      // Transform data to match UI expectations
      const attachment = response.data;
      return {
        ...attachment,
        id: attachment.Id,
        name: attachment.Name,
        taskId: attachment.task_id,
        uploadedBy: attachment.uploaded_by
      };
    } catch (error) {
      console.error(`Error fetching attachment with ID ${id}:`, error);
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
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "task_id" } },
          { "Field": { "Name": "size" } },
          { "Field": { "Name": "type" } },
          { "Field": { "Name": "uploaded_by" } }
        ],
        "where": [
          {
            "FieldName": "task_id",
            "Operator": "ExactMatch",
            "Values": [taskId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords("Attachment1", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(attachment => ({
        ...attachment,
        id: attachment.Id,
        name: attachment.Name,
        taskId: attachment.task_id,
        uploadedBy: attachment.uploaded_by
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching attachments by task:", error);
      return [];
    }
  },

  async create(attachmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: attachmentData.name,
          Tags: "",
          Owner: attachmentData.uploadedBy,
          task_id: parseInt(attachmentData.taskId),
          size: parseInt(attachmentData.size),
          type: attachmentData.type,
          uploaded_by: attachmentData.uploadedBy
        }]
      };

      const response = await apperClient.createRecord("Attachment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} attachments:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const attachment = successfulRecords[0].data;
          return {
            ...attachment,
            id: attachment.Id,
            name: attachment.Name,
            taskId: attachment.task_id,
            uploadedBy: attachment.uploaded_by
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating attachment:", error);
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

      const response = await apperClient.deleteRecord("Attachment1", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false };
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} attachments:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return { success: successfulDeletions.length > 0 };
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      throw error;
    }
  }
};

export default attachmentService;