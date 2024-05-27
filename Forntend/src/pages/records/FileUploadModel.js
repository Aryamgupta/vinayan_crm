import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      // onClose();
      // Show success toast with delay of 2000 milliseconds (2 seconds) and padding
      toast.success("Files successfully uploaded!", {
        autoClose: 2000, // Delay in milliseconds
        toastClassName: "custom-toast", // Custom class for toast styling
      });
    } else {
      toast.error("Please select at least one file to upload.", {
        autoClose: 2000,
        toastClassName: "custom-toast",
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-full">
     
      <div className="bg-white p-4 rounded-md shadow-lg">
        <h2 className="text-xl mb-4">Upload Files</h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Upload
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
