import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "Speech Activity Builder API is healthy",
    },
    {
      status: 200,
    }
  );
}