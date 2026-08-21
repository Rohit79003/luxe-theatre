import { NextRequest } from "next/server";
import { validateCouponSchema } from "@/lib/validations/coupon";
import { validateCoupon } from "@/lib/services/coupon.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = validateCouponSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return errorResponse("Validation failed for coupon request", formattedErrors, 400);
    }

    const { code, total } = parseResult.data;
    const result = validateCoupon(code, total);

    return successResponse(result);
  } catch (error: any) {
    console.error("POST /api/coupons/validate error:", error);
    return errorResponse(error.message || "Failed to validate coupon", null, 500);
  }
}
