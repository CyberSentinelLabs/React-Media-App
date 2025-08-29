import React, { useState } from "react";
import { MediaContext } from "./mediaContextObject"; // Import the context object

// Media Provider component to wrap around parts of your app that need access to media state
// This file now solely exports the MediaProvider component.
export const MediaProvider = ({ children }) => {
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
