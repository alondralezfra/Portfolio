import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // The e2e script serves the production build with `vite preview` on this port.
    baseUrl: "http://localhost:4173/Portfolio/",
    setupNodeEvents(on) {
      // Lets tests print details (for example axe violations) in the terminal and CI log.
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
