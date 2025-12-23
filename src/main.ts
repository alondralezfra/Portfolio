import { Model } from "./model";
import { View } from "./view";
import { Controller } from "./controller";
import { logger } from "./logging/logger";

/**
 * Application entry point.
 */
function main(): void {

    logger.info("Application starting")
    const root = document.getElementById("app");

    if (!root) {
        throw new Error("Root element #app not found");
    }

    const model = new Model();
    const view = new View(root);
    const controller = new Controller(model, view);

    controller.init();
}

/* Run app once the DOM is fully loaded */
document.addEventListener("DOMContentLoaded", () => {
    main();
});
