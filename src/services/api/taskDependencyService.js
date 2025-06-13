import { toast } from 'react-toastify';

const taskDependencyService = {
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
          { "Field": { "Name": "predecessorTaskId" } },
          { "Field": { "Name": "successorTaskId" } }
        ]
      };

      const response = await apperClient.fetchRecords("taskDependency", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching task dependencies:", error);
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
        fields: ["Id", "Name", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy", "predecessorTaskId", "successorTaskId"]
      };

      const response = await apperClient.getRecordById("taskDependency", id, params);

      if (!response || !response.data) {
        throw new Error('Task dependency not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task dependency with ID ${id}:`, error);
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
          { "Field": { "Name": "predecessorTaskId" } },
          { "Field": { "Name": "successorTaskId" } }
        ],
        "whereGroups": [
          {
            "operator": "OR",
            "SubGroups": [
              {
                "conditions": [
                  {
                    "FieldName": "predecessorTaskId",
                    "Operator": "ExactMatch",
                    "Values": [taskId.toString()]
                  }
                ],
                "operator": ""
              },
              {
                "conditions": [
                  {
                    "FieldName": "successorTaskId",
                    "Operator": "ExactMatch",
                    "Values": [taskId.toString()]
                  }
                ],
                "operator": ""
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords("taskDependency", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching task dependencies by task ID:", error);
      return [];
    }
  },

  async create(dependencyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: dependencyData.name || `Dependency ${dependencyData.predecessorTaskId} -> ${dependencyData.successorTaskId}`,
          Tags: dependencyData.tags || "",
          Owner: dependencyData.owner,
          predecessorTaskId: parseInt(dependencyData.predecessorTaskId),
          successorTaskId: parseInt(dependencyData.successorTaskId)
        }]
      };

      const response = await apperClient.createRecord("taskDependency", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task dependencies:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task dependency:", error);
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
          Owner: updates.owner,
          predecessorTaskId: updates.predecessorTaskId ? parseInt(updates.predecessorTaskId) : undefined,
          successorTaskId: updates.successorTaskId ? parseInt(updates.successorTaskId) : undefined
        }]
      };

      const response = await apperClient.updateRecord("taskDependency", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task dependencies:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task dependency:", error);
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

      const response = await apperClient.deleteRecord("taskDependency", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task dependencies:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting task dependency:", error);
      throw error;
    }
  }
};

export default taskDependencyService;