import React, { useContext } from "react";
import { AppContext } from "../AppContext";

const ResultsPage = () => {
  const { setPage } = useContext(AppContext);
  return (
    <div className="page-container">
      <h2 className="page-title">Results</h2>
      <p className="page-subtitle">
        {" "}
        There are no results to display.
        <br /> Upload a file, make a video recording or an audio recording to
        see results.
      </p>

      <p className="page-subtitle"></p>

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
      </div>
      <button onClick={() => setPage("home")} className="nav-button">
        Back
      </button>
    </div>
  );
};

export default ResultsPage;
