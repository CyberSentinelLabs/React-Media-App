import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";

const RecordPage = () => {
  // We use the useState hook here to manage local component state.
  const { setPage } = useContext(AppContext);
  const [recordingStatus, setRecordingStatus] = useState("idle");

  const startRecording = async (type) => {
    setRecordingStatus("loading");
    try {
      const constraints = {
        video: type === "video-audio",
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setRecordingStatus("recording");
      console.log(`Successfully started ${type} recording stream.`);
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setRecordingStatus("denied");
      alert(
        "Permission denied. Please allow access to your camera and microphone."
      );
    }
  };

  const getStatusMessage = () => {
    switch (recordingStatus) {
      case "loading":
        return "Requesting permissions...";
      case "recording":
        return "Recording in progress...";
      case "denied":
        return "Permissions denied. Check your browser settings.";
      case "idle":
      default:
        return "";
    }
  };

  return (
    <div className="page-container record-page">
      <h2 className="title-text">Record Media</h2>
      <div className="button-group">
        <button
          onClick={() => startRecording("video-audio")}
          className="record-button video-button"
        >
          Record Video & Audio
        </button>
        <button
          onClick={() => startRecording("audio-only")}
          className="record-button audio-button"
        >
          Record Audio Only
        </button>
      </div>
      {recordingStatus !== "idle" && (
        <p className="status-text">{getStatusMessage()}</p>
      )}
      <button onClick={() => setPage("home")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default RecordPage;
