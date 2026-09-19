import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["tasks/**/*.test.ts"],
    globals: true,
    typecheck: { enabled: true, include: ["tasks/**/*.test.ts"] },
  },
});
