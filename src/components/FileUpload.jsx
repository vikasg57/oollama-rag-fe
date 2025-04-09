import React, { useState } from "react";

const FileUpload = ({ onUploadSuccess, setError }) => {
  const [file, setFile] = useState(null);
  const [indexName, setIndexName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      
      // Generate a default index name from the file name (without extension)
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setIndexName(fileName.toLowerCase().replace(/\s+/g, "_"));
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file");
      return;
    }
    
    if (!indexName.trim()) {
      setError("Please enter an index name");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("index_name", indexName);
    
    setIsUploading(true);
    setProgress(10);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const response = await fetch("http://127.0.0.1:8000/75605149-f19c-434c-b2cc-15ab6991e8e3/upload-pdf/", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }
      
      setProgress(100);
      setTimeout(() => {
        onUploadSuccess(indexName);
        setFile(null);
        setProgress(0);
      }, 500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <label htmlFor="file-upload" className="file-input-label">
            {file ? file.name : "Choose PDF file"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="index-name">Index Name:</label>
          <input
            id="index-name"
            type="text"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
            placeholder="Enter index name"
            required
          />
        </div>
        
        <button
          type="submit"
          className="upload-button"
          disabled={isUploading || !file}
        >
          {isUploading ? "Uploading..." : "Upload PDF"}
        </button>
        
        {isUploading && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload; 