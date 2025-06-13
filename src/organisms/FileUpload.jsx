import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import attachmentService from '@/services/api/attachmentService';

const FileUpload = ({ taskId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [completedUploads, setCompletedUploads] = useState([]);

  const simulateUpload = async (file) => {
    const fileId = Date.now() + Math.random();
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
    }

    try {
      const attachmentData = {
        taskId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: 'Current User'
      };

      await attachmentService.create(attachmentData);
      setCompletedUploads(prev => [...prev, fileId]);
      
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        setCompletedUploads(prev => prev.filter(id => id !== fileId));
        onUploadComplete();
      }, 1000);

    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    try {
      await Promise.all(acceptedFiles.map(file => simulateUpload(file)));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [taskId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    }
  });

  const activeUploads = Object.keys(uploadProgress);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports images, PDFs, Word docs, Excel files (max 10MB each)
        </p>
      </div>

      {activeUploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading files...</h4>
          {activeUploads.map(fileId => {
            const progress = uploadProgress[fileId];
            const isCompleted = completedUploads.includes(fileId);
            
            return (
              <div key={fileId} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Uploading file...</span>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{progress}% complete</span>
                  {isCompleted && <span className="text-green-600 font-medium">Complete!</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;