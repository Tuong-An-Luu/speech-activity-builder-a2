import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const wordSchema = z.object({
  text: z.string().trim().min(1, "Word is required"),

  hint: z.string().trim().optional(),

  wordListId: z.number().int().positive("A valid word list is required"),

  phonemes: z
    .array(z.string().trim().min(1, "Phoneme cannot be empty"))
    .min(1, "At least one phoneme is required"),
});

export async function GET() {
  try {
    const words = await prisma.word.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(words, { status: 200 });
  } catch (error) {
    console.error("GET words error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve words" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = wordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid word data",
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

    const word = await prisma.word.create({
      data: {
        text: result.data.text,

        hint: result.data.hint || null,

        wordListId: result.data.wordListId,

        phonemes: {
          create: result.data.phonemes.map((symbol, index) => ({
            symbol,
            position: index,
          })),
        },
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

    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    console.error("POST word error:", error);

    return NextResponse.json(
      { error: "Unable to create word" },
      { status: 500 }
    );
  }
}