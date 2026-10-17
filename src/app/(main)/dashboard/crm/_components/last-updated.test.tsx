import { act } from "react";

import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { LastUpdated } from "./last-updated";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("shows the browser local date when UTC is already on the next day", async () => {
  vi.setSystemTime(new Date("2026-10-18T01:30:00Z"));
  await act(() => {
    root = createRoot(container);
    root.render(<LastUpdated />);
  });
  expect(container.textContent).toBe("Last updated: October 17, 2026");
});

it("reads a fresh date when the page mounts again", async () => {
  vi.setSystemTime(new Date("2027-01-01T20:00:00Z"));
  await act(() => {
    root = createRoot(container);
    root.render(<LastUpdated />);
  });
  expect(container.textContent).toBe("Last updated: January 1, 2027");
  await act(() => root.unmount());
  vi.setSystemTime(new Date("2027-01-02T20:00:00Z"));
  await act(() => {
    root = createRoot(container);
    root.render(<LastUpdated />);
  });
  expect(container.textContent).toBe("Last updated: January 2, 2027");
});

it("hydrates without a mismatch when the server render predates the browser date", async () => {
  vi.setSystemTime(new Date("2026-10-01T12:00:00Z"));
  container.innerHTML = renderToString(<LastUpdated />);
  expect(container.textContent).toBe("");
  vi.setSystemTime(new Date("2026-10-18T01:30:00Z"));
  const onRecoverableError = vi.fn();
  await act(() => {
    root = hydrateRoot(container, <LastUpdated />, { onRecoverableError });
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(container.textContent).toBe("Last updated: October 17, 2026");
});
