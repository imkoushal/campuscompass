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
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            placements: { where: { year: 2024 }, take: 1 },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ savedColleges: saved });
  } catch {
    return NextResponse.json({ error: "Failed to fetch saved colleges" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { collegeId } = await req.json();
    if (!collegeId) {
      return NextResponse.json({ error: "College ID required" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;

    // Toggle: if already saved, unsave it
    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });

    if (existing) {
      await prisma.savedCollege.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false, message: "College unsaved" });
    }

    const saved = await prisma.savedCollege.create({
      data: { userId, collegeId },
    });

    return NextResponse.json({ saved: true, data: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save college" }, { status: 500 });
  }
}
