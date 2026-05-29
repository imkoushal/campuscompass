import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [states, types] = await Promise.all([
      prisma.college.findMany({ select: { state: true }, distinct: ["state"], orderBy: { state: "asc" } }),
      prisma.college.findMany({ select: { type: true }, distinct: ["type"], orderBy: { type: "asc" } }),
    ]);

    return NextResponse.json({
      states: states.map((s) => s.state),
      types: types.map((t) => t.type),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}
