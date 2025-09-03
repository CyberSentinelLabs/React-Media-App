import React, { useContext } from "react";
import { AppContext } from "../AppContext";

const NavLink = ({ pageName, text }) => {
  const { setPage } = useContext(AppContext);
  return (
    <button
      onClick={() => setPage(pageName)}
      className="mt-6 text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors"
    >
      {text}
    </button>
  );
};

export default NavLink;
