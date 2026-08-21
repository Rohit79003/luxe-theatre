import { NextRequest } from "next/server";
import { paymentSchema } from "@/lib/validations/payment";
import { processPayment } from "@/lib/services/payment.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = paymentSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return errorResponse("Validation failed for payment processing", formattedErrors, 400);
    }

    const { bookingId } = parseResult.data;
    const paymentResult = await processPayment(bookingId);

    return successResponse(paymentResult);
  } catch (error: any) {
    console.error("POST /api/payments error:", error);
    return errorResponse(error.message || "Failed to process payment", null, 400);
  }
}
