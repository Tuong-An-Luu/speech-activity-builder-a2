import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

const updateWordSchema = z
  .object({
    text: z.string().trim().min(1, "Word cannot be empty").optional(),

    hint: z.string().trim().optional(),

    wordListId: z.number().int().positive().optional(),

    phonemes: z
      .array(z.string().trim().min(1, "Phoneme cannot be empty"))
      .min(1, "At least one phoneme is required")
      .optional(),
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
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return NextResponse.json(
        { error: "Invalid word ID" },
        { status: 400 }
      );
    }

    const word = await prisma.word.findUnique({
      where: {
        id: wordId,
      },

      include: {
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },

        wordList: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!word) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(word, { status: 200 });
  } catch (error) {
    console.error("GET word error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve word" },
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
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return NextResponse.json(
        { error: "Invalid word ID" },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!existingWord) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const result = updateWordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid word data",
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

    const word = await prisma.word.update({
      where: {
        id: wordId,
      },

      data: {
        ...(result.data.text !== undefined && {
          text: result.data.text,
        }),

        ...(result.data.hint !== undefined && {
          hint: result.data.hint || null,
        }),

        ...(result.data.wordListId !== undefined && {
          wordListId: result.data.wordListId,
        }),

        ...(result.data.phonemes !== undefined && {
          phonemes: {
            deleteMany: {},

            create: result.data.phonemes.map((symbol, index) => ({
              symbol,
              position: index,
            })),
          },
        }),
      },

      include: {
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },

        wordList: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(word, { status: 200 });
  } catch (error) {
    console.error("PUT word error:", error);

    return NextResponse.json(
      { error: "Unable to update word" },
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
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return NextResponse.json(
        { error: "Invalid word ID" },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!existingWord) {
      return NextResponse.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });

    return NextResponse.json(
      {
        message: "Word deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE word error:", error);

    return NextResponse.json(
      { error: "Unable to delete word" },
      { status: 500 }
    );
  }
}