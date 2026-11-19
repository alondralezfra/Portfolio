import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // The e2e script serves the production build with `vite preview` on this port.
    baseUrl: "http://localhost:4173/Portfolio/",
    setupNodeEvents(_on, _config) {
      // no plugins yet
    },
  },
});
