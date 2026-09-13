import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

const updateActivitySchema = z
  .object({
    name: z.string().trim().min(1, "Activity name cannot be empty").optional(),

    activityType: z.enum(["WORDLE", "WORD_SEARCH"]).optional(),

    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),

    hintsEnabled: z.boolean().optional(),

    gridSize: z.number().int().positive().optional(),

    timerSeconds: z.number().int().positive().optional(),

    outputName: z.string().trim().optional(),

    settingsJson: z.string().optional(),

    wordListId: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },

      include: {
        wordList: {
          include: {
            words: {
              include: {
                phonemes: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.error("GET activity error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve activity" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const existingActivity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = updateActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid activity data",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    if (result.data.wordListId !== undefined) {
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
    }

    const activity = await prisma.activity.update({
      where: {
        id: activityId,
      },

      data: {
        ...(result.data.name !== undefined && {
          name: result.data.name,
        }),

        ...(result.data.activityType !== undefined && {
          activityType: result.data.activityType,
        }),

        ...(result.data.difficulty !== undefined && {
          difficulty: result.data.difficulty,
        }),

        ...(result.data.hintsEnabled !== undefined && {
          hintsEnabled: result.data.hintsEnabled,
        }),

        ...(result.data.gridSize !== undefined && {
          gridSize: result.data.gridSize,
        }),

        ...(result.data.timerSeconds !== undefined && {
          timerSeconds: result.data.timerSeconds,
        }),

        ...(result.data.outputName !== undefined && {
          outputName: result.data.outputName || null,
        }),

        ...(result.data.settingsJson !== undefined && {
          settingsJson: result.data.settingsJson || null,
        }),

        ...(result.data.wordListId !== undefined && {
          wordListId: result.data.wordListId,
        }),
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

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.error("PUT activity error:", error);

    return NextResponse.json(
      { error: "Unable to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const existingActivity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    return NextResponse.json(
      {
        message: "Activity deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE activity error:", error);

    return NextResponse.json(
      { error: "Unable to delete activity" },
      { status: 500 }
    );
  }
}