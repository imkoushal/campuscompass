import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: { orderBy: { degree: "asc" } },
        placements: { orderBy: { year: "desc" } },
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true, savedBy: true } },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Calculate average rating from reviews
    const avgRating = await prisma.review.aggregate({
      where: { collegeId: college.id },
      _avg: { rating: true },
    });

    return NextResponse.json({
      ...college,
      avgReviewRating: avgRating._avg.rating || college.rating,
    });
  } catch (error) {
    console.error("Error fetching college:", error);
    return NextResponse.json({ error: "Failed to fetch college" }, { status: 500 });
  }
}
