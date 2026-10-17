import { expect, test } from "vitest";

// Start the local app on port 3102, or set TEST_BASE_URL to an existing local stack.
test("finance dashboard serves its page-specific document title", async () => {
  const url = new URL("/dashboard/finance", process.env.TEST_BASE_URL ?? "http://localhost:3102");
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });

  expect(response.status).toBe(200);
  expect(response.url).toBe(url.href);
  const html = await response.text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  expect(head).toBeDefined();
  const titles = [...(head ?? "").matchAll(/<title>([^<]*)<\/title>/g)].map((match) => match[1]);
  expect(titles).toEqual(["Finance Dashboard"]);
}, 35_000);
