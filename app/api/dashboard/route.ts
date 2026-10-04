import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const [
      wordListCount,
      wordCount,
      wordleActivityCount,
      wordSearchActivityCount,
      successfulGenerationCount,
      failedGenerationCount,
      pageTimeStats,
      recentEvents,
      generationEvents,
      emptyWordListCount,
    ] = await Promise.all([
      prisma.wordList.count(),

      prisma.word.count(),

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
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION_FAILURE",
        },
      }),

      prisma.usageEvent.aggregate({
        where: {
          eventType: "PAGE_VIEW",
          durationMs: {
            not: null,
          },
        },
        _avg: {
          durationMs: true,
        },
      }),

      prisma.usageEvent.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      prisma.usageEvent.findMany({
        where: {
          eventType: "GENERATION_SUCCESS",
          activityType: {
            not: null,
          },
        },
        select: {
          activityType: true,
        },
      }),

      prisma.wordList.count({
        where: {
          words: {
            none: {},
          },
        },
      }),
    ]);

    let wordleUsage = 0;
    let wordSearchUsage = 0;

    for (const event of generationEvents) {
      if (event.activityType === "WORDLE") {
        wordleUsage++;
      }

      if (event.activityType === "WORD_SEARCH") {
        wordSearchUsage++;
      }
    }

    let mostUsedActivityType = "No usage data";

    if (wordleUsage > wordSearchUsage) {
      mostUsedActivityType = "Wordle";
    } else if (wordSearchUsage > wordleUsage) {
      mostUsedActivityType = "Word Search";
    } else if (wordleUsage > 0 && wordSearchUsage > 0) {
      mostUsedActivityType = "Equal usage";
    }

    const alerts: Array<{
      type: "success" | "warning";
      message: string;
    }> = [];

    alerts.push({
      type: "success",
      message: "System health check is operational.",
    });

    if (failedGenerationCount > 0) {
      alerts.push({
        type: "warning",
        message: `${failedGenerationCount} failed generation event(s) recorded.`,
      });
    }

    if (emptyWordListCount > 0) {
      alerts.push({
        type: "warning",
        message: `${emptyWordListCount} word list(s) currently contain no words.`,
      });
    }

    return NextResponse.json({
      health: "Healthy",

      totals: {
        wordLists: wordListCount,
        words: wordCount,
        wordleActivities: wordleActivityCount,
        wordSearchActivities: wordSearchActivityCount,
      },

      generation: {
        successful: successfulGenerationCount,
        failed: failedGenerationCount,
      },

      usage: {
        averageTimeOnPageMs: Math.round(
          pageTimeStats._avg.durationMs ?? 0
        ),
        mostUsedActivityType,
        wordleGenerations: wordleUsage,
        wordSearchGenerations: wordSearchUsage,
      },

      alerts,

      recentEvents,
    });
  } catch (error) {
    console.error("Failed to load dashboard data:", error);

    return NextResponse.json(
      {
        health: "Unhealthy",
        error: "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}