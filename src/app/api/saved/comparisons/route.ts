import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ comparisons });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comparisons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { name, collegeIds } = await req.json();
    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return NextResponse.json({ error: "At least 2 college IDs required" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;
    const comparison = await prisma.savedComparison.create({
      data: { userId, name: name || "Comparison", collegeIds },
    });

    return NextResponse.json(comparison, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save comparison" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await req.json();
    const userId = (session.user as { id: string }).id;

    await prisma.savedComparison.deleteMany({ where: { id, userId } });
    return NextResponse.json({ message: "Comparison deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete comparison" }, { status: 500 });
  }
}
