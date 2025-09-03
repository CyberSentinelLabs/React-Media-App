import { createContext } from "react";

// This context is used to share the 'setPage' function
// across the entire application without prop drilling.
export const AppContext = createContext();
