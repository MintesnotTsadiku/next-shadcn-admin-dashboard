"use client";

import { useEffect, useState } from "react";

export function LastUpdated() {
  const [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    // Read the browser clock after hydration, rather than the build server clock.
    setDisplayDate(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  }, []);

  return <p className="min-h-4 text-muted-foreground text-xs">{displayDate ? `Last updated: ${displayDate}` : null}</p>;
}
