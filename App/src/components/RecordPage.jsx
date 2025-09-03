import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";

const RecordPage = () => {
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
      alert(
        "Permission denied. Please allow access to your camera and microphone."
      );
      setRecordingStatus("denied");
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
    <div className="page-container">
      <h2 className="page-title">Make A Recording</h2>
      <p className="page-subtitle">
        Choose an option below to record video with audio or record audio only.{" "}
        <p>
          Your recording can be processed and analyzed  in the results page.
        </p>
      </p>
      <div className="button-group-vertical">
        <button
          onClick={() => startRecording("video-audio")}
          className="action-button video-button"
        >
          Record Video & Audio
        </button>
        <button
          onClick={() => startRecording("audio-only")}
          className="action-button audio-button"
        >
          Record Audio Only
        </button>
      </div>
      {recordingStatus !== "idle" && (
        <p className="status-message">{getStatusMessage()}</p>
      )}
      <button onClick={() => setPage("home")} className="nav-button">
        Back
      </button>
    </div>
  );
};

export default RecordPage;
