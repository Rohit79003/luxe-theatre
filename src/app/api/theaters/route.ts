import { NextRequest } from "next/server";
import { getAllTheaters } from "@/lib/services/theater.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const theaters = await getAllTheaters();
    return successResponse(theaters);
  } catch (error: any) {
    console.error("GET /api/theaters error:", error);
    return errorResponse(error.message || "Failed to fetch theaters", null, 500);
  }
}
