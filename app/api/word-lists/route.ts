import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";

const wordListSchema = z.object({
  name: z.string().trim().min(1, "List name is required"),
  description: z.string().trim().optional(),
});

export async function GET() {
  try {
    const wordLists = await prisma.wordList.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wordLists, { status: 200 });
  } catch (error) {
    console.error("GET word lists error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve word lists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = wordListSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid word list data",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.create({
      data: {
        name: result.data.name,
        description: result.data.description || null,
      },
    });

    return NextResponse.json(wordList, { status: 201 });
  } catch (error) {
    console.error("POST word list error:", error);

    return NextResponse.json(
      { error: "Unable to create word list" },
      { status: 500 }
    );
  }
}