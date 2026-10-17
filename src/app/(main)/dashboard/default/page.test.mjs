import assert from "node:assert/strict";
import test from "node:test";

// Start the local app on port 3199, or set TEST_BASE_URL to an existing local stack.
test("default dashboard serves its page-specific document title", async () => {
  const url = new URL("/dashboard/default", process.env.TEST_BASE_URL ?? "http://localhost:3199");
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });

  assert.equal(response.status, 200);
  assert.equal(response.url, url.href);
  const html = await response.text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "Response must contain a document head");
  const titles = [...head.matchAll(/<title>([^<]*)<\/title>/g)].map((match) => match[1]);
  assert.deepEqual(titles, ["Default Dashboard"]);
});
