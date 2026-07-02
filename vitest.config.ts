import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only include vitest unit tests, exclude Playwright e2e folder
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["tests/**", "node_modules/**"],
  },
});
