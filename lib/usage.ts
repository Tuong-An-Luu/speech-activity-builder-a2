export type UsageEventInput = {
  eventType: string;
  activityType?: "WORDLE" | "WORD_SEARCH";
  pagePath?: string;
  durationMs?: number;
  message?: string;
};

export async function recordUsageEvent(
  event: UsageEventInput,
) {
  try {
    const response = await fetch("/api/usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      console.error(
        "Failed to record usage event:",
        response.status,
      );
    }
  } catch (error) {
    console.error(
      "Failed to record usage event:",
      error,
    );
  }
}