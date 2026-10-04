import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const event = await prisma.usageEvent.create({
      data: {
        eventType: body.eventType,
        activityType: body.activityType ?? null,
        pagePath: body.pagePath ?? null,
        durationMs: body.durationMs ?? null,
        message: body.message ?? null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create usage event:", error);

    return NextResponse.json(
      { error: "Failed to create usage event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.usageEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to retrieve usage events:", error);

    return NextResponse.json(
      { error: "Failed to retrieve usage events" },
      { status: 500 }
    );
  }
}