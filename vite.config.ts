import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "side-panel": "src/side-panel/index.html",
        "main-stage": "src/main-stage/index.html",
      },
    },
  },
  test: {
    environment: "node",
  },
});
