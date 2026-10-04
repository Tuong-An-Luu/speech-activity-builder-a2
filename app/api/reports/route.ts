import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const [
      wordleActivities,
      wordSearchActivities,
      wordleSuccesses,
      wordSearchSuccesses,
      wordleFailures,
      wordSearchFailures,
      pageViewEvents,
      totalEvents,
      activityCreatedEvents,
      recentEvents,
    ] = await Promise.all([
      prisma.activity.count({
        where: {
          activityType: "WORDLE",
        },
      }),

      prisma.activity.count({
        where: {
          activityType: "WORD_SEARCH",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION_SUCCESS",
          activityType: "WORDLE",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION_SUCCESS",
          activityType: "WORD_SEARCH",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION_FAILURE",
          activityType: "WORDLE",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION_FAILURE",
          activityType: "WORD_SEARCH",
        },
      }),

      prisma.usageEvent.findMany({
        where: {
          eventType: "PAGE_VIEW",
          pagePath: {
            not: null,
          },
          durationMs: {
            not: null,
          },
        },
        select: {
          pagePath: true,
          durationMs: true,
        },
      }),

      prisma.usageEvent.count(),

      prisma.usageEvent.count({
        where: {
          eventType: "ACTIVITY_CREATED",
        },
      }),

      prisma.usageEvent.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }),
    ]);

    const pageMap = new Map<
      string,
      {
        views: number;
        totalDurationMs: number;
      }
    >();

    for (const event of pageViewEvents) {
      if (!event.pagePath || event.durationMs === null) {
        continue;
      }

      const existing = pageMap.get(event.pagePath) ?? {
        views: 0,
        totalDurationMs: 0,
      };

      existing.views += 1;
      existing.totalDurationMs += event.durationMs;

      pageMap.set(event.pagePath, existing);
    }

    const pageUsage = Array.from(pageMap.entries()).map(
      ([pagePath, stats]) => ({
        pagePath,
        views: stats.views,
        averageTimeMs: Math.round(
          stats.totalDurationMs / stats.views
        ),
      })
    );

    return NextResponse.json({
      activitySummary: [
        {
          activityType: "Wordle",
          storedActivities: wordleActivities,
          successfulGenerations: wordleSuccesses,
          failedGenerations: wordleFailures,
        },
        {
          activityType: "Word Search",
          storedActivities: wordSearchActivities,
          successfulGenerations: wordSearchSuccesses,
          failedGenerations: wordSearchFailures,
        },
      ],

      eventSummary: {
        totalEvents,
        pageViews: pageViewEvents.length,
        activityCreatedEvents,
      },

      pageUsage,

      recentEvents,
    });
  } catch (error) {
    console.error("Failed to load report data:", error);

    return NextResponse.json(
      {
        error: "Failed to load report data",
      },
      {
        status: 500,
      }
    );
  }
}