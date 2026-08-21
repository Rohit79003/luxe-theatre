import { NextRequest } from "next/server";
import { getSlotsAvailability } from "@/lib/services/slot.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date") || undefined;
    const theaterIdStr = searchParams.get("theaterId") || undefined;

    let theaterId: number | undefined;
    if (theaterIdStr) {
      theaterId = parseInt(theaterIdStr, 10);
      if (isNaN(theaterId)) {
        return errorResponse("Invalid theaterId query parameter", null, 400);
      }
    }

    if (dateStr && !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return errorResponse("Date parameter must be in YYYY-MM-DD format", null, 400);
    }

    const slots = await getSlotsAvailability(dateStr, theaterId);
    return successResponse(slots);
  } catch (error: any) {
    console.error("GET /api/slots error:", error);
    return errorResponse(error.message || "Failed to fetch slot availability", null, 500);
  }
}
