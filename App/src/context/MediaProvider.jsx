import React, { useState } from "react";
import { MediaContext } from "./mediaContextObject";

// This file solely exports the MediaProvider component, wrapping the application
// and providing the media state. This is for optimal Fast Refresh support.
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
