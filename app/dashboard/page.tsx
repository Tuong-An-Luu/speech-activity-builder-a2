"use client";

import { useEffect, useState } from "react";

type RecentEvent = {
  id: number;
  eventType: string;
  activityType: string | null;
  pagePath: string | null;
  durationMs: number | null;
  message: string | null;
  createdAt: string;
};

type Alert = {
  type: "success" | "warning";
  message: string;
};

type DashboardData = {
  health: string;

  totals: {
    wordLists: number;
    words: number;
    wordleActivities: number;
    wordSearchActivities: number;
  };

  generation: {
    successful: number;
    failed: number;
  };

  usage: {
    averageTimeOnPageMs: number;
    mostUsedActivityType: string;
    wordleGenerations: number;
    wordSearchGenerations: number;
  };

  alerts: Alert[];
  recentEvents: RecentEvent[];
};

function formatDuration(milliseconds: number) {
  if (!milliseconds) {
    return "0 sec";
  }

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
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatActivityType(value: string | null) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Dashboard request failed");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      }
    }

    loadDashboard();
  }, []);

  if (error) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl p-6">
        <h1 className="text-3xl font-bold">Operational Dashboard</h1>

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
        <h1 className="text-3xl font-bold">Operational Dashboard</h1>

        <p className="mt-4 opacity-75">
          Loading dashboard data...
        </p>
      </main>
    );
  }

  const cards = [
    {
      title: "System Health",
      value: data.health,
    },
    {
      title: "Word Lists",
      value: data.totals.wordLists,
    },
    {
      title: "Stored Words",
      value: data.totals.words,
    },
    {
      title: "Wordle Activities",
      value: data.totals.wordleActivities,
    },
    {
      title: "Word Search Activities",
      value: data.totals.wordSearchActivities,
    },
    {
      title: "Successful Generations",
      value: data.generation.successful,
    },
    {
      title: "Failed Generations",
      value: data.generation.failed,
    },
    {
      title: "Average Time on Page",
      value: formatDuration(data.usage.averageTimeOnPageMs),
    },
    {
      title: "Most-used Activity",
      value: data.usage.mostUsedActivityType,
    },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Operational Dashboard
        </h1>

        <p className="mt-2 opacity-75">
          Database-backed monitoring and usage statistics for the Speech
          Activity Builder.
        </p>
      </div>

      {/* System summary */}
      <section aria-labelledby="summary-heading">
        <h2
          id="summary-heading"
          className="mb-4 text-2xl font-semibold"
        >
          System Summary
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="
                rounded-xl
                border
                border-[rgba(127,127,127,0.28)]
                bg-[rgba(127,127,127,0.08)]
                p-5
                shadow-sm
                transition
                hover:bg-[rgba(127,127,127,0.12)]
                hover:shadow-md
              "
            >
              <p className="text-sm font-medium opacity-75">
                {card.title}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity usage */}
      <section className="mt-10" aria-labelledby="usage-heading">
        <h2
          id="usage-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Activity Usage
        </h2>

        <div
          className="
            overflow-x-auto
            rounded-xl
            border
            border-[rgba(127,127,127,0.28)]
            bg-[rgba(127,127,127,0.05)]
            shadow-sm
          "
        >
          <table className="w-full text-left">
            <thead
              className="
                border-b
                border-[rgba(127,127,127,0.28)]
                bg-[rgba(127,127,127,0.12)]
              "
            >
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Activity Type
                </th>

                <th scope="col" className="px-4 py-3 font-semibold">
                  Successful Generations
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                className="
                  border-b
                  border-[rgba(127,127,127,0.22)]
                  hover:bg-[rgba(127,127,127,0.08)]
                "
              >
                <td className="px-4 py-3">Wordle</td>

                <td className="px-4 py-3">
                  {data.usage.wordleGenerations}
                </td>
              </tr>

              <tr className="hover:bg-[rgba(127,127,127,0.08)]">
                <td className="px-4 py-3">Word Search</td>

                <td className="px-4 py-3">
                  {data.usage.wordSearchGenerations}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Operational alerts */}
      <section className="mt-10" aria-labelledby="alerts-heading">
        <h2
          id="alerts-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Operational Alerts
        </h2>

        <div className="space-y-3">
          {data.alerts.map((alert, index) => (
            <div
              key={`${alert.message}-${index}`}
              className={
                alert.type === "warning"
                  ? "rounded-lg border border-amber-500/50 bg-amber-500/10 p-4"
                  : "rounded-lg border border-green-500/50 bg-green-500/10 p-4"
              }
            >
              <strong>
                {alert.type === "warning"
                  ? "Warning: "
                  : "Healthy: "}
              </strong>

              {alert.message}
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-10" aria-labelledby="events-heading">
        <h2
          id="events-heading"
          className="mb-4 text-2xl font-semibold"
        >
          Recent Activity
        </h2>

        <div
          className="
            overflow-x-auto
            rounded-xl
            border
            border-[rgba(127,127,127,0.28)]
            bg-[rgba(127,127,127,0.05)]
            shadow-sm
          "
        >
          <table className="w-full text-left text-sm">
            <thead
              className="
                border-b
                border-[rgba(127,127,127,0.28)]
                bg-[rgba(127,127,127,0.12)]
              "
            >
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Time
                </th>

                <th scope="col" className="px-4 py-3 font-semibold">
                  Event
                </th>

                <th scope="col" className="px-4 py-3 font-semibold">
                  Activity
                </th>

                <th scope="col" className="px-4 py-3 font-semibold">
                  Details
                </th>
              </tr>
            </thead>

            <tbody>
              {data.recentEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center opacity-70"
                  >
                    No recent activity has been recorded.
                  </td>
                </tr>
              ) : (
                data.recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="
                      border-b
                      border-[rgba(127,127,127,0.22)]
                      last:border-b-0
                      hover:bg-[rgba(127,127,127,0.08)]
                    "
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(event.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      {formatEventType(event.eventType)}
                    </td>

                    <td className="px-4 py-3">
                      {formatActivityType(event.activityType)}
                    </td>

                    <td className="px-4 py-3">
                      <div>{event.message ?? "—"}</div>

                      {event.durationMs !== null && (
                        <div className="mt-1 text-sm opacity-70">
                          Duration: {formatDuration(event.durationMs)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}