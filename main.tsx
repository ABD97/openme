import React from "react";
import { createRoot } from "react-dom/client";
import BirthdayPage from "./openme";


const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<BirthdayPage />);
}
