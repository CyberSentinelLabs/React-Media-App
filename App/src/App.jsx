import React, { useState } from "react";
import { AppContext } from "./AppContext";
import HomePage from "./components/HomePage";
import UploadPage from "./components/UploadPage";
import RecordPage from "./components/RecordPage";
import ResultsPage from "./components/ResultsPage";
import "./App.css";

const App = () => {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "upload":
        return <UploadPage />;
      case "record":
        return <RecordPage />;
      case "results":
        return <ResultsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContext.Provider value={{ setPage }}>
      <div className="app-container">
        <header className="app-header">
          <button onClick={() => setPage("home")} className="app-title">Cyber Sentinel</button>
          <nav className="main-nav">
            <button onClick={() => setPage("home")} className="nav-button">
              Home
            </button>
            <button onClick={() => setPage("upload")} className="nav-button">
              Upload
            </button>
            <button onClick={() => setPage("record")} className="nav-button">
              Record
            </button>
            <button onClick={() => setPage("results")} className="nav-button">
              Results
            </button>
          </nav>
        </header>
        <main className="main-content-container">
          <div className="page-card">{renderPage()}</div>
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
