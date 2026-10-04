"use client";

import { useEffect, useRef } from "react";

type ActivityType = "WORDLE" | "WORD_SEARCH";

type PageTimeTrackerProps = {
  pagePath: string;
  activityType?: ActivityType;
};

export default function PageTimeTracker({
  pagePath,
  activityType,
}: PageTimeTrackerProps) {
  const startTimeRef = useRef<number>(0);
  const sentRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    sentRef.current = false;

    function sendPageTime() {
      if (sentRef.current) {
        return;
      }

      const durationMs =
        Date.now() - startTimeRef.current;

      // Ignore extremely short development/refresh events.
      if (durationMs < 1000) {
        return;
      }

      sentRef.current = true;

      const payload = {
        eventType: "PAGE_VIEW",
        activityType,
        pagePath,
        durationMs,
        message: `Recorded time spent on ${pagePath}`,
      };

      const json = JSON.stringify(payload);

      // sendBeacon is reliable when leaving/closing a page.
      if (navigator.sendBeacon) {
        const blob = new Blob(
          [json],
          {
            type: "application/json",
          },
        );

        navigator.sendBeacon(
          "/api/usage",
          blob,
        );

        return;
      }

      // Fallback for browsers where sendBeacon is unavailable.
      fetch("/api/usage", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: json,
        keepalive: true,
      }).catch((error) => {
        console.error(
          "Failed to record page time:",
          error,
        );
      });
    }

    function handlePageHide() {
      sendPageTime();
    }

    window.addEventListener(
      "pagehide",
      handlePageHide,
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        handlePageHide,
      );

      sendPageTime();
    };
  }, [pagePath, activityType]);

  return null;
}