import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css"; // This import expects App.css to be directly in the src/ directory
import { MediaProvider } from "./context/MediaProvider"; // This import expects MediaProvider.jsx in src/context/
import { useMedia } from "./hooks/UseMedia"; // This import expects useMedia.jsx in src/hooks/

// -------------------------------------------------------------------------------- //
// 2. Navigation Bar Component
// -------------------------------------------------------------------------------- //

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Media App
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/upload" className="navbar-link">
            Upload
          </Link>
          <Link to="/record" className="navbar-link">
            Record
          </Link>
          <Link to="/results" className="navbar-link">
            Results
          </Link>
        </div>
      </div>
    </nav>
  );
};

// -------------------------------------------------------------------------------- //
// 3. Page Components
// -------------------------------------------------------------------------------- //

// Home Page
const HomePage = () => {
  return (
    <div className="page-container home-page-container">
      <div className="card home-card">
        <h1 className="main-title">Welcome to the Media Processing App!</h1>
        <p className="page-description">
          This application allows you to upload audio/video files or record new
          media directly from your device. Once processed, you can view the
          results.
        </p>
        <div className="button-group">
          <Link to="/upload" className="action-button primary-button">
            Go to Upload
          </Link>
          <Link to="/record" className="action-button secondary-button">
            Go to Record
          </Link>
        </div>
      </div>
    </div>
  );
};

// Upload Page with integrated UploadForm
const UploadPage = () => {
  const { selectedFile, setSelectedFile } = useMedia();
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const ALLOWED_FILE_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];
  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  const processFile = (file) => {
    setErrorMessage("");
    if (!file) {
      setErrorMessage("No file selected.");
      setSelectedFile(null);
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage(
        `Invalid file type. Please upload an audio or video file (${ALLOWED_FILE_TYPES.map(
          (t) => t.split("/")[1]
        ).join(", ")}).`
      );
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File size exceeds the limit of ${
          MAX_FILE_SIZE_BYTES / (1024 * 1024)
        } MB.`
      );
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    navigate("/results"); // Automatically navigate to results after selection
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="page-container upload-page-container">
      <div className="card upload-card">
        <h2 className="section-title">Upload Audio/Video</h2>

        <div
          className={`drop-zone ${isDragging ? "drop-zone-dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <svg
            className="drop-zone-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="drop-zone-text">Drag & drop your file here, or</p>
          <button
            type="button"
            className="browse-button"
            onClick={handleBrowseClick}
          >
            Browse File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden-file-input"
            accept={ALLOWED_FILE_TYPES.join(",")}
          />
        </div>

        {selectedFile && (
          <div className="file-info-box">
            <p className="file-info-title">Selected File:</p>
            <p>
              <span className="file-info-label">Name:</span> {selectedFile.name}
            </p>
            <p>
              <span className="file-info-label">Type:</span> {selectedFile.type}
            </p>
            <p>
              <span className="file-info-label">Size:</span>{" "}
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="error-message-box">
            <p className="error-message-title">Error:</p>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Record Page
const RecordPage = () => {
  const { setRecordedMedia } = useMedia();
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      }); // Only audio for now
      setStream(mediaStream);
      setIsRecording(true);
      setAudioChunks([]); // Clear previous chunks

      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const recordedFile = new File(
          [audioBlob],
          `recorded-audio-${Date.now()}.webm`,
          { type: "audio/webm" }
        );
        setRecordedMedia(recordedFile);
        mediaStream.getTracks().forEach((track) => track.stop()); // Stop all tracks
        setStream(null);
        setIsRecording(false);
        navigate("/results"); // Navigate to results after recording
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      // Using a custom alert/modal is recommended for production apps instead of window.alert
      alert(
        "Could not access microphone. Please check permissions and ensure no other application is using it."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  useEffect(() => {
    // Cleanup function: stop media stream when component unmounts or stream changes
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="page-container record-page-container">
      <div className="card record-card">
        <h2 className="section-title">Record Audio/Video</h2>
        <p className="page-description">
          Click the button below to start recording audio from your microphone.
          The recording will automatically stop and navigate to results once
          finished.
        </p>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`action-button ${
            isRecording ? "stop-recording-button" : "start-recording-button"
          }`}
          disabled={
            isRecording &&
            mediaRecorder?.state === "recording" &&
            audioChunks.length === 0
          }
        >
          {isRecording ? (
            <div className="button-loading">
              <span className="spinner-ping"></span>
              <span className="spinner-dot"></span>
              Stop Recording
            </div>
          ) : (
            "Start Recording"
          )}
        </button>

        {isRecording && (
          <p className="recording-status-text">
            Recording... Click "Stop Recording" to finish.
          </p>
        )}
      </div>
    </div>
  );
};

// Results Page
const ResultsPage = () => {
  const { selectedFile, recordedMedia, setSelectedFile, setRecordedMedia } =
    useMedia();
  const navigate = useNavigate();

  const handleClear = () => {
    setSelectedFile(null);
    setRecordedMedia(null);
    navigate("/");
  };

  return (
    <div className="page-container results-page-container">
      <div className="card results-card">
        <h2 className="section-title">Processing Results</h2>

        {selectedFile && (
          <div className="result-info-box file-result-box">
            <h3 className="result-info-title">Uploaded File Details:</h3>
            <p>
              <span className="result-info-label">Name:</span>{" "}
              {selectedFile.name}
            </p>
            <p>
              <span className="result-info-label">Type:</span>{" "}
              {selectedFile.type}
            </p>
            <p>
              <span className="result-info-label">Size:</span>{" "}
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="result-message">
              This file is ready for backend processing.
            </p>
          </div>
        )}

        {recordedMedia && (
          <div className="result-info-box record-result-box">
            <h3 className="result-info-title">Recorded Media Details:</h3>
            <p>
              <span className="result-info-label">Name:</span>{" "}
              {recordedMedia.name}
            </p>
            <p>
              <span className="result-info-label">Type:</span>{" "}
              {recordedMedia.type}
            </p>
            <p>
              <span className="result-info-label">Size:</span>{" "}
              {(recordedMedia.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <audio
              controls
              src={URL.createObjectURL(recordedMedia)}
              className="media-player"
            ></audio>
            <p className="result-message">
              This recorded media is ready for backend processing.
            </p>
          </div>
        )}

        {!selectedFile && !recordedMedia && (
          <p className="no-media-message">
            No media has been uploaded or recorded yet. Please go to the{" "}
            <Link to="/upload" className="inline-link">
              Upload
            </Link>{" "}
            or{" "}
            <Link to="/record" className="inline-link">
              Record
            </Link>{" "}
            page.
          </p>
        )}

        {(selectedFile || recordedMedia) && (
          <button
            onClick={handleClear}
            className="action-button clear-media-button"
          >
            Clear Media & Start Over
          </button>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------------- //
// 4. Main App Component (Integrates Navbar and Routes)
// -------------------------------------------------------------------------------- //

function App() {
  return (
    <MediaProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
    </MediaProvider>
  );
}

export default App;
