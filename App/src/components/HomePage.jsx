import React, { useContext } from "react";
import { AppContext } from "../AppContext";

const HomePage = () => {
  // We use the useContext hook here to access the 'setPage' function.
  const { setPage } = useContext(AppContext);
  return (
    <div className="page-container home-page">
      <h2 className="title-text">Welcome to Media Manager</h2>
      <p className="subtitle-text">
        Navigate to the different sections to upload or record your media.
      </p>
      <div className="button-container">
        <button onClick={() => setPage("upload")} className="nav-button">
          Upload
        </button>
        <button onClick={() => setPage("record")} className="nav-button">
          Record
        </button>
        <button onClick={() => setPage("results")} className="nav-button">
          Results
        </button>
      </div>
    </div>
  );
};

export default HomePage;
