import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";

const UploadPage = () => {
  // We use the useState hook here to manage local component state.
  const { setPage } = useContext(AppContext);
  const [fileError, setFileError] = useState("");
  const [fileDetails, setFileDetails] = useState(null);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileError("");
    setFileDetails(null);

    if (!file) {
      return;
    }

    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const fileSize = file.size;

    if (!allowedExtensions.has(fileExtension)) {
      setFileError(
        "File type not supported. Please upload a .wav, .flac, .m4a, .mp3, .ogg, .opus, or .mp4 file."
      );
      return;
    }

    if (fileSize < minSizeBytes) {
      setFileError(`File size is too small. Minimum is ${minSizeKB} KB.`);
      return;
    }
    if (fileSize > maxSizeBytes) {
      setFileError(`File size is too large. Maximum is ${maxSizeMB} MB.`);
      return;
    }

    setFileDetails(file);
    alert("File uploaded successfully!");
    console.log("File:", file);
  };

  return (
    <div className="page-container upload-page">
      <h2 className="title-text">Upload Media</h2>
      <div className="upload-box">
        <label htmlFor="file-upload" className="upload-label">
          Choose a file to upload
        </label>
        <div className="file-input-wrapper">
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="file-input"
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
      <button onClick={() => setPage("home")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default UploadPage;
