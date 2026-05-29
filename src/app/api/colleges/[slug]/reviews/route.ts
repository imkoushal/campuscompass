import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(2000),
  category: z.enum(["academics", "placements", "campus", "faculty", "general"]).default("general"),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const college = await prisma.college.findUnique({ where: { slug } });
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { collegeId: college.id },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { collegeId: college.id } }),
    ]);

    return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { slug } = await params;
    const college = await prisma.college.findUnique({ where: { slug } });
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = reviewSchema.parse(body);
    const userId = (session.user as { id: string }).id;

    const review = await prisma.review.create({
      data: { ...data, collegeId: college.id, userId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
