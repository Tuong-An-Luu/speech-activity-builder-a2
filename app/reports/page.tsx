"use client";

import { useEffect, useState } from "react";

type ActivitySummary = {
  activityType: string;
  storedActivities: number;
  successfulGenerations: number;
  failedGenerations: number;
};

type PageUsage = {
  pagePath: string;
  views: number;
  averageTimeMs: number;
};

type RecentEvent = {
  id: number;
  eventType: string;
  activityType: string | null;
  pagePath: string | null;
  durationMs: number | null;
  message: string | null;
  createdAt: string;
};

type ReportData = {
  activitySummary: ActivitySummary[];

  eventSummary: {
    totalEvents: number;
    pageViews: number;
    activityCreatedEvents: number;
  };

  pageUsage: PageUsage[];
  recentEvents: RecentEvent[];
};

function formatDuration(milliseconds: number) {
  const seconds = Math.round(milliseconds / 1000);

  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

function formatEventType(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function formatActivityType(value: string | null) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/reports", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Reports request failed");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load reporting data.");
      }
    }

    loadReports();
  }, []);

  if (error) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl p-6">
        <h1 className="text-3xl font-bold">
          Activity Reports
        </h1>

        <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4">
          <strong>Error: </strong>
          {error}
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl p-6">
        <h1 className="text-3xl font-bold">
          Activity Reports
        </h1>

        <p className="mt-4 opacity-75">
          Loading report data...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Activity Reports
        </h1>

        <p className="mt-2 opacity-75">
          Database-backed reporting for Wordle, Word Search
          and recorded application usage.
        </p>
      </div>

      {/* Event summary */}
      <section aria-labelledby="event-summary-heading">
        <h2
          id="event-summary-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Reporting Summary
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.08)] p-5 shadow-sm">
            <p className="text-sm font-medium opacity-75">
              Total Usage Events
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.eventSummary.totalEvents}
            </p>
          </div>

          <div className="rounded-xl border border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.08)] p-5 shadow-sm">
            <p className="text-sm font-medium opacity-75">
              Page Views
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.eventSummary.pageViews}
            </p>
          </div>

          <div className="rounded-xl border border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.08)] p-5 shadow-sm">
            <p className="text-sm font-medium opacity-75">
              Activity Creation Events
            </p>

            <p className="mt-2 text-3xl font-bold">
              {data.eventSummary.activityCreatedEvents}
            </p>
          </div>
        </div>
      </section>

      {/* Activity report */}
      <section
        className="mt-10"
        aria-labelledby="activity-report-heading"
      >
        <h2
          id="activity-report-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Activity Report
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.05)] shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.12)]">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Activity Type
                </th>

                <th scope="col" className="px-4 py-3">
                  Stored Activities
                </th>

                <th scope="col" className="px-4 py-3">
                  Successful Generations
                </th>

                <th scope="col" className="px-4 py-3">
                  Failed Generations
                </th>
              </tr>
            </thead>

            <tbody>
              {data.activitySummary.map((activity) => (
                <tr
                  key={activity.activityType}
                  className="border-b border-[rgba(127,127,127,0.22)] last:border-b-0 hover:bg-[rgba(127,127,127,0.08)]"
                >
                  <td className="px-4 py-3">
                    {activity.activityType}
                  </td>

                  <td className="px-4 py-3">
                    {activity.storedActivities}
                  </td>

                  <td className="px-4 py-3">
                    {activity.successfulGenerations}
                  </td>

                  <td className="px-4 py-3">
                    {activity.failedGenerations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Page usage */}
      <section
        className="mt-10"
        aria-labelledby="page-usage-heading"
      >
        <h2
          id="page-usage-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Page Usage
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.05)] shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.12)]">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Page
                </th>

                <th scope="col" className="px-4 py-3">
                  Recorded Visits
                </th>

                <th scope="col" className="px-4 py-3">
                  Average Time
                </th>
              </tr>
            </thead>

            <tbody>
              {data.pageUsage.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center opacity-70"
                  >
                    No page-usage records are available.
                  </td>
                </tr>
              ) : (
                data.pageUsage.map((page) => (
                  <tr
                    key={page.pagePath}
                    className="border-b border-[rgba(127,127,127,0.22)] last:border-b-0 hover:bg-[rgba(127,127,127,0.08)]"
                  >
                    <td className="px-4 py-3">
                      {page.pagePath}
                    </td>

                    <td className="px-4 py-3">
                      {page.views}
                    </td>

                    <td className="px-4 py-3">
                      {formatDuration(page.averageTimeMs)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent events */}
      <section
        className="mt-10"
        aria-labelledby="recent-events-heading"
      >
        <h2
          id="recent-events-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Recent Recorded Events
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.05)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[rgba(127,127,127,0.28)] bg-[rgba(127,127,127,0.12)]">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Time
                </th>

                <th scope="col" className="px-4 py-3">
                  Event
                </th>

                <th scope="col" className="px-4 py-3">
                  Activity
                </th>

                <th scope="col" className="px-4 py-3">
                  Details
                </th>
              </tr>
            </thead>

            <tbody>
              {data.recentEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-[rgba(127,127,127,0.22)] last:border-b-0 hover:bg-[rgba(127,127,127,0.08)]"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(
                      event.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    {formatEventType(event.eventType)}
                  </td>

                  <td className="px-4 py-3">
                    {formatActivityType(
                      event.activityType
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {event.message ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}