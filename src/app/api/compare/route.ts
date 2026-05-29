import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json({ error: "Provide college IDs via ?ids=id1,id2,id3" }, { status: 400 });
    }

    const collegeIds = ids.split(",").map((id) => id.trim()).slice(0, 3);

    if (collegeIds.length < 2) {
      return NextResponse.json({ error: "At least 2 college IDs required" }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json({ error: "Could not find enough colleges" }, { status: 404 });
    }

    // Compute comparison highlights
    const highlights = {
      bestRating: colleges.reduce((a, b) => (a.rating > b.rating ? a : b)).id,
      lowestFees: colleges.reduce((a, b) => {
        const aFees = (a.fees as Record<string, number>)?.btech || Infinity;
        const bFees = (b.fees as Record<string, number>)?.btech || Infinity;
        return aFees < bFees ? a : b;
      }).id,
      highestPackage: colleges.reduce((a, b) => {
        const aP = a.placements[0]?.highestPackage || 0;
        const bP = b.placements[0]?.highestPackage || 0;
        return aP > bP ? a : b;
      }).id,
      bestPlacement: colleges.reduce((a, b) => {
        const aP = a.placements[0]?.placementPercentage || 0;
        const bP = b.placements[0]?.placementPercentage || 0;
        return aP > bP ? a : b;
      }).id,
    };

    return NextResponse.json({ colleges, highlights });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json({ error: "Failed to compare colleges" }, { status: 500 });
  }
}
