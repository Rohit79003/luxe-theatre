import { NextRequest } from "next/server";
import { getBookingById } from "@/lib/services/booking.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return errorResponse("Invalid booking ID format", null, 400);
    }

    const booking = await getBookingById(id);
    if (!booking) {
      return errorResponse(`Booking with ID ${id} not found`, null, 404);
    }

    return successResponse(booking);
  } catch (error: any) {
    console.error(`GET /api/bookings/:id error:`, error);
    return errorResponse(error.message || "Failed to fetch booking details", null, 500);
  }
}
