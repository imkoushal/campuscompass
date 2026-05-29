import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const type = searchParams.get("type") || "";
    const minFees = searchParams.get("minFees");
    const maxFees = searchParams.get("maxFees");
    const minRating = searchParams.get("minRating");
    const sortBy = searchParams.get("sortBy") || "rating";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    if (state) {
      const states = state.split(",").map((s) => s.trim());
      where.state = { in: states };
    }

    if (type) {
      const types = type.split(",").map((t) => t.trim());
      where.type = { in: types };
    }

    if (minRating) {
      where.rating = { ...(where.rating as object || {}), gte: parseFloat(minRating) };
    }

    // Sort
    const orderBy: Record<string, string> = {};
    if (sortBy === "fees") {
      orderBy.name = sortOrder; // fallback - can't sort by JSON directly
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else {
      orderBy.rating = sortOrder;
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where: where as never,
        orderBy: orderBy as never,
        skip,
        take: limit,
        include: {
          placements: { where: { year: 2024 }, take: 1 },
          _count: { select: { reviews: true, courses: true } },
        },
      }),
      prisma.college.count({ where: where as never }),
    ]);

    // Post-filter by fees if needed (JSON field filtering)
    let filtered = colleges;
    if (minFees || maxFees) {
      filtered = colleges.filter((c) => {
        const fees = c.fees as Record<string, number> | null;
        if (!fees?.btech) return false;
        if (minFees && fees.btech < parseInt(minFees)) return false;
        if (maxFees && fees.btech > parseInt(maxFees)) return false;
        return true;
      });
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      colleges: filtered,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
