import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

const updateWordListSchema = z
  .object({
    name: z.string().trim().min(1, "List name cannot be empty").optional(),
    description: z.string().trim().optional(),
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
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
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
        activities: true,
      },
    });

    if (!wordList) {
      return NextResponse.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(wordList, { status: 200 });
  } catch (error) {
    console.error("GET word list error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve word list" },
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
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    const existingWordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
    });

    if (!existingWordList) {
      return NextResponse.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateWordListSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid word list data",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.update({
      where: {
        id: wordListId,
      },
      data: {
        ...(result.data.name !== undefined && {
          name: result.data.name,
        }),

        ...(result.data.description !== undefined && {
          description: result.data.description || null,
        }),
      },
    });

    return NextResponse.json(wordList, { status: 200 });
  } catch (error) {
    console.error("PUT word list error:", error);

    return NextResponse.json(
      { error: "Unable to update word list" },
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
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    const existingWordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
    });

    if (!existingWordList) {
      return NextResponse.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    await prisma.wordList.delete({
      where: {
        id: wordListId,
      },
    });

    return NextResponse.json(
      { message: "Word list deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE word list error:", error);

    return NextResponse.json(
      { error: "Unable to delete word list" },
      { status: 500 }
    );
  }
}