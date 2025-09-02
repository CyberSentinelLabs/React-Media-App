import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "tailwindcss/tailwind.css";

// -------------------------------------------------------------------------------- //
// 1. Context and Hooks (all within this single file)
// -------------------------------------------------------------------------------- //

// Context object
const MediaContext = createContext();

// Custom hook to consume the context
const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};

// Provider component
const MediaProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordedMedia, setRecordedMedia] = useState(null);

  const value = {
    selectedFile,
    setSelectedFile,
    recordedMedia,
    setRecordedMedia,
  };

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

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
    "audio/mp3",
    "audio/wav",
    "audio/flac",
    "audio/m4a",
    "audio/ogg",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-m4v",
    "video/mpeg",
  ];
  const MIN_FILE_SIZE_BYTES = 50 * 1024; // 50 KB
  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  const processFile = (file) => {
    setErrorMessage("");
    if (!file) {
      setErrorMessage("No file selected.");
      setSelectedFile(null);
      return;
    }
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage(
        `Invalid file type. Please upload a supported audio or video file.`
      );
      setSelectedFile(null);
      return;
    }
    // Check file size
    if (file.size < MIN_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File size is too small. Minimum size is ${
          MIN_FILE_SIZE_BYTES / 1024
        } KB.`
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
  const [mediaChunks, setMediaChunks] = useState([]);
  const [isAudioOnly, setIsAudioOnly] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      // Request both audio and video permissions
      const constraints = { audio: true, video: !isAudioOnly };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      setIsRecording(true);
      setMediaChunks([]); // Clear previous chunks

      // Attach the stream to the video element for live preview
      if (videoRef.current && !isAudioOnly) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm; codecs=vp8,opus",
      }); // Supported format
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setMediaChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.onstop = () => {
        const mediaBlob = new Blob(mediaChunks, { type: "video/webm" });
        const fileExtension = isAudioOnly ? "webm" : "webm";
        const recordedFile = new File(
          [mediaBlob],
          `recorded-media-${Date.now()}.${fileExtension}`,
          { type: mediaBlob.type }
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
        "Could not access microphone/camera. Please check permissions and ensure no other application is using it."
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
          Toggle the switch to choose between audio and video recording.
        </p>

        {/* Toggle Switch for Audio/Video */}
        <div className="flex items-center justify-center my-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={!isAudioOnly}
                onChange={() => setIsAudioOnly(!isAudioOnly)}
                disabled={isRecording}
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                  !isAudioOnly ? "translate-x-6 bg-indigo-500" : ""
                }`}
              ></div>
            </div>
            <div className="ml-3 text-gray-700 font-semibold">
              {isAudioOnly ? "Audio Only" : "Audio & Video"}
            </div>
          </label>
        </div>

        {!isAudioOnly && (
          <div className="video-preview-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="video-preview"
            ></video>
          </div>
        )}

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`action-button ${
            isRecording ? "stop-recording-button" : "start-recording-button"
          }`}
          disabled={
            isRecording &&
            mediaRecorder?.state === "recording" &&
            mediaChunks.length === 0
          }
        >
          {isRecording ? (
            <div className="button-loading">
              <span className="spinner-ping"></span>
              <span className="spinner-dot"></span>
              Stop Recording
            </div>
          ) : (
            `Start Recording ${isAudioOnly ? "(Audio)" : "(Audio & Video)"}`
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

  const getMediaType = (file) => {
    return file.type.startsWith("audio/") ? "audio" : "video";
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
            {getMediaType(selectedFile) === "audio" ? (
              <audio
                controls
                src={URL.createObjectURL(selectedFile)}
                className="media-player"
              ></audio>
            ) : (
              <video
                controls
                src={URL.createObjectURL(selectedFile)}
                className="media-player"
              ></video>
            )}
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
            {getMediaType(recordedMedia) === "audio" ? (
              <audio
                controls
                src={URL.createObjectURL(recordedMedia)}
                className="media-player"
              ></audio>
            ) : (
              <video
                controls
                src={URL.createObjectURL(recordedMedia)}
                className="media-player"
              ></video>
            )}
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
