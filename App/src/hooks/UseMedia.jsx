import { useContext } from "react";
import { MediaContext } from "../context/mediaContextObject"; // Corrected: Import MediaContext from its object file in the context folder

// Custom hook to easily consume the media context
// This hook is now in its own file to satisfy Fast Refresh
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
