import { db } from "@/lib/db";
import { Review } from "@/types"; // Adjust if your Review type is elsewhere

interface ReviewQuery {
  productId: string;
  page?: number;
  limit?: number;
}

export async function productReviews(query: ReviewQuery): Promise<any[]> {
  const { productId, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  return await db.review.findMany({
    where: {
      productId,
    },
    include: {
      images: true,
      videos: true,
      categoryRatings: true,
      product: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    skip,
    take: limit,
  });
}