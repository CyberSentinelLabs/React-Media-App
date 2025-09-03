import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";

const UploadPage = () => {
  const { setPage } = useContext(AppContext);
  const [fileError, setFileError] = useState("");
  const [fileDetails, setFileDetails] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const allowedExtensions = new Set([
    "wav",
    "flac",
    "m4a",
    "mp3",
    "ogg",
    "opus",
    "mp4",
  ]);
  const minSizeKB = 50;
  const maxSizeMB = 50;
  const minSizeBytes = minSizeKB * 1024;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file) => {
    if (!file) {
      return false;
    }
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const fileSize = file.size;

    if (!allowedExtensions.has(fileExtension)) {
      setFileError(
        "File type not supported. Please upload a .wav, .flac, .m4a, .mp3, .ogg, .opus, or .mp4 file."
      );
      return false;
    }
    if (fileSize < minSizeBytes) {
      setFileError(`File size is too small. Minimum is ${minSizeKB} KB.`);
      return false;
    }
    if (fileSize > maxSizeBytes) {
      setFileError(`File size is too large. Maximum is ${maxSizeMB} MB.`);
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    setFileError("");
    setFileDetails(null);
    if (validateFile(file)) {
      setFileDetails(file);
      alert("File uploaded successfully!");
      console.log("File:", file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleFileSelect = (event) => {
    if (event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Upload A File</h2>
      <div className="form-section">
        <div
          className={`drag-drop-area ${isDragging ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="icon-wrapper">
            <svg
              className="upload-icon"
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          {/* <p className="drag-drop-text">Drag and drop your file here</p> */}
          <p className="drag-drop-subtext">
            Drag and drop your file here or click to browse
          </p>
          <p className="drag-drop-info">
            Upload files in: .wav, .flac, .mp3, .mp4, .m4a, .ogg, .opus etc.
          </p>
          <p className="drag-drop-info">Maximum Size = 50MB</p>
          <input
            type="file"
            className="file-input-hidden"
            onChange={handleFileSelect}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {fileError && <p className="error-text">{fileError}</p>}
        {fileDetails && (
          <div className="file-details">
            <p className="details-text">
              Selected File:{" "}
              <span className="details-text-bold">{fileDetails.name}</span>
            </p>
            <p className="details-text">
              Size:{" "}
              <span className="details-text-bold">
                {(fileDetails.size / 1024).toFixed(2)} KB
              </span>
            </p>
          </div>
        )}
      </div>
      <button onClick={() => setPage("home")} className="nav-button">
        Back
      </button>
    </div>
  );
};

export default UploadPage;
