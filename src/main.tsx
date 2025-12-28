import React from "react";
import ReactDOM from "react-dom/client";
import AppView from "./view";
import { logger } from "./logging/logger";

/**
 * Entry point to the application.
 */
function main(): void {
  logger.info("React app starting");

  // Boot up react app
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppView />
    </React.StrictMode>
  );
}

document.addEventListener("DOMContentLoaded", main);
