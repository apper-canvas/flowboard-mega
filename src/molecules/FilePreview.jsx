import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const FilePreview = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <img
            src={`/api/placeholder/800/600`}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">{file.name}</p>
            <p className="text-gray-600 mb-4">PDF Preview</p>
            <p className="text-sm text-gray-500">
              PDF preview would be displayed here in a real application
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">{file.name}</p>
          <p className="text-gray-600">Preview not available for this file type</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">{file.name}</h3>
            <p className="text-sm text-gray-500">
              {file.type} • {Math.round(file.size / 1024)} KB
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => window.open('#', '_blank')}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;