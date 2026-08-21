import { NextRequest } from "next/server";
import { createBookingSchema } from "@/lib/validations/booking";
import { createBooking } from "@/lib/services/booking.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = createBookingSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return errorResponse("Validation failed for booking creation", formattedErrors, 400);
    }

    const booking = await createBooking(parseResult.data);
    return successResponse(booking, 201);
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return errorResponse(error.message || "Failed to create booking", null, 400);
  }
}
