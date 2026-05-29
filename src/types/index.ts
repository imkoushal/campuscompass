import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

// College types for frontend use
export interface CollegeListItem {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  type: string;
  logo: string | null;
  rating: number;
  established: number | null;
  fees: Record<string, number> | null;
  ranking: Record<string, number> | null;
  placements: PlacementData[];
  _count: { reviews: number; courses: number };
}

export interface CollegeDetail extends CollegeListItem {
  banner: string | null;
  description: string | null;
  website: string | null;
  affiliation: string | null;
  highlights: Record<string, unknown> | null;
  courses: CourseData[];
  reviews: ReviewData[];
  avgReviewRating: number;
  _count: { reviews: number; savedBy: number; courses: number };
}

export interface CourseData {
  id: string;
  name: string;
  degree: string;
  duration: string;
  fees: number | null;
  feesType: string | null;
  eligibility: string | null;
  seats: number | null;
}

export interface PlacementData {
  id: string;
  year: number;
  avgPackage: number | null;
  medianPackage: number | null;
  highestPackage: number | null;
  lowestPackage: number | null;
  placementPercentage: number | null;
  topRecruiters: string[] | null;
}

export interface ReviewData {
  id: string;
  rating: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

export interface CollegesResponse {
  colleges: CollegeListItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface CompareResponse {
  colleges: (CollegeListItem & { courses: CourseData[] })[];
  highlights: {
    bestRating: string;
    lowestFees: string;
    highestPackage: string;
    bestPlacement: string;
  };
}
