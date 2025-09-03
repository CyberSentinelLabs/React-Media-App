import React, { useContext } from "react";
import { AppContext } from "../AppContext";

const ResultsPage = () => {
  const { setPage } = useContext(AppContext);
  return (
    <div className="page-container results-page">
      <h2 className="title-text">Results</h2>
      <p className="subtitle-text">
        This page will display the results of your uploads and recordings.
      </p>
      <button onClick={() => setPage("home")} className="back-button">
        Back to Home
      </button>
    </div>
  );
};

export default ResultsPage;
