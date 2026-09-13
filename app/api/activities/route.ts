import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const activitySchema = z.object({
  name: z.string().trim().min(1, "Activity name is required"),

  activityType: z.enum(["WORDLE", "WORD_SEARCH"]),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),

  hintsEnabled: z.boolean().default(true),

  gridSize: z.number().int().positive().optional(),

  timerSeconds: z.number().int().positive().optional(),

  outputName: z.string().trim().optional(),

  settingsJson: z.string().optional(),

  wordListId: z.number().int().positive("A valid word list is required"),
});

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        wordList: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("GET activities error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = activitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid activity data",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.findUnique({
      where: {
        id: result.data.wordListId,
      },
    });

    if (!wordList) {
      return NextResponse.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        name: result.data.name,
        activityType: result.data.activityType,
        difficulty: result.data.difficulty,
        hintsEnabled: result.data.hintsEnabled,
        gridSize: result.data.gridSize ?? null,
        timerSeconds: result.data.timerSeconds ?? null,
        outputName: result.data.outputName || null,
        settingsJson: result.data.settingsJson || null,
        wordListId: result.data.wordListId,
      },

      include: {
        wordList: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("POST activity error:", error);

    return NextResponse.json(
      { error: "Unable to create activity" },
      { status: 500 }
    );
  }
}