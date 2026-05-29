import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ isSaved: false });
    }

    const collegeId = req.nextUrl.searchParams.get("collegeId");
    if (!collegeId) {
      return NextResponse.json({ error: "College ID required" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });

    return NextResponse.json({ isSaved: !!saved });
  } catch {
    return NextResponse.json({ isSaved: false });
  }
}
