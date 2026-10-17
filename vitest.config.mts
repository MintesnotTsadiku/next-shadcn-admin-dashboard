import { defineConfig } from "vitest/config";

// Exercise local dates that differ from UTC, regardless of the test host timezone.
process.env.TZ = "America/Los_Angeles";

export default defineConfig({
  test: { environment: "jsdom" },
});
