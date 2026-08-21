import { NextRequest } from "next/server";
import { getAddOns } from "@/lib/services/addon.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const addOns = await getAddOns(category);
    return successResponse(addOns);
  } catch (error: any) {
    console.error("GET /api/addons error:", error);
    return errorResponse(error.message || "Failed to fetch add-ons", null, 500);
  }
}
