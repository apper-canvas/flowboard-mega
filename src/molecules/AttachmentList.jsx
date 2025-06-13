import React, { useState, useEffect } from 'react';
import { File, Image, FileText, Download, Trash2, Eye } from 'lucide-react';
import attachmentService from '@/services/api/attachmentService';
import FilePreview from '@/molecules/FilePreview';

const AttachmentList = ({ taskId, onAttachmentDeleted }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      const data = await attachmentService.getByTaskId(taskId);
      setAttachments(data);
    } catch (error) {
      console.error('Failed to load attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    try {
      await attachmentService.delete(attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
      onAttachmentDeleted();
    } catch (error) {
      console.error('Failed to delete attachment:', error);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    if (type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (type.includes('word') || type.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    if (type.includes('sheet') || type.includes('excel')) {
      return <FileText className="w-5 h-5 text-green-600" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canPreview = (type) => {
    return type.startsWith('image/') || type === 'application/pdf';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <File className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p>No attachments yet</p>
        <p className="text-sm">Upload files to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {getFileIcon(attachment.type)}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)} • {attachment.uploadedBy}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {canPreview(attachment.type) && (
                <button
                  onClick={() => setPreviewFile(attachment)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => window.open('#', '_blank')}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(attachment.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <FilePreview
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
};

export default AttachmentList;