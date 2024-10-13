import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import AppWithRoutes from "./routes";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppWithRoutes />
  </React.StrictMode>
);
