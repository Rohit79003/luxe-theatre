import { NextRequest } from "next/server";
import { plannerSchema } from "@/lib/validations/planner";
import { generatePlannerRecommendation } from "@/lib/planner/recommendation";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = plannerSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return errorResponse("Validation failed for planner request", formattedErrors, 400);
    }

    const recommendation = await generatePlannerRecommendation(parseResult.data);
    if (!recommendation) {
      return errorResponse(
        "No matching theatre or experience package fits your guest count and budget criteria.",
        null,
        404
      );
    }

    return successResponse(recommendation);
  } catch (error: any) {
    console.error("POST /api/planner error:", error);
    return errorResponse(error.message || "Failed to process AI planner request", null, 500);
  }
}
