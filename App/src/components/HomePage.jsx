import React, { useContext } from "react";
import { AppContext } from "../AppContext";

const HomePage = () => {
  const { setPage } = useContext(AppContext);
  return (
    <div className="page-container">
      <h2 className="page-title">Welcome to Cyber Sentinel</h2>
      <p>Ready to get started?</p>
      <p className="page-subtitle">
        Choose an option below to upload your media, record something new or check results of previous files.
      </p>
      <div className="button-group">
        <button
          onClick={() => setPage("upload")}
          className="main-action-button primary"
        >
          Upload
        </button>
        <button
          onClick={() => setPage("record")}
          className="main-action-button secondary"
        >
          Record
        </button>
        <button
          onClick={() => setPage("results")}
          className="main-action-button tertiary"
        >
          Results
        </button>
      </div>
    </div>
  );
};

export default HomePage;
