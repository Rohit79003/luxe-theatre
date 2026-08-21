import { NextRequest } from "next/server";
import { confirmBookingSchema } from "@/lib/validations/confirm";
import { getBookingById } from "@/lib/services/booking.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = confirmBookingSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return errorResponse("Validation failed for booking confirmation", formattedErrors, 400);
    }

    const { bookingId } = parseResult.data;
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return errorResponse(`Booking #${bookingId} not found`, null, 404);
    }

    if (booking.paymentStatus !== "PAID") {
      return errorResponse(
        `Booking #${bookingId} is not confirmed because payment status is ${booking.paymentStatus}`,
        null,
        400
      );
    }

    return successResponse({
      status: "CONFIRMED",
      booking: {
        id: booking.id,
        location: booking.location,
        date: booking.date,
        guests: booking.guests,
        customer: {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
        },
        occasion: booking.occasion,
        theater: booking.theater,
        slot: booking.slot,
        cartItems: booking.cartItems,
        total: booking.total,
        paymentStatus: booking.paymentStatus,
        receiptNumber: `LX-REC-${booking.id}-${Date.now().toString().slice(-6)}`,
        confirmedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/booking/confirm error:", error);
    return errorResponse(error.message || "Failed to fetch booking confirmation", null, 500);
  }
}
