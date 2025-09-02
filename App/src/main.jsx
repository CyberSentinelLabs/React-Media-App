import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// No other global CSS is imported here to avoid compilation issues.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
