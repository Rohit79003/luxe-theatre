import { NextRequest } from "next/server";
import { getTheaterById } from "@/lib/services/theater.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return errorResponse("Invalid theater ID format", null, 400);
    }

    const theater = await getTheaterById(id);
    if (!theater) {
      return errorResponse(`Theater with ID ${id} not found`, null, 404);
    }

    return successResponse(theater);
  } catch (error: any) {
    console.error(`GET /api/theaters/:id error:`, error);
    return errorResponse(error.message || "Failed to fetch theater details", null, 500);
  }
}
