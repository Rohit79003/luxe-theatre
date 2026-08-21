export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discount: number;
  finalTotal: number;
  message?: string;
}

const VALID_COUPONS: Record<string, { type: "PERCENT" | "FLAT"; value: number; description: string }> = {
  LUXE10: { type: "PERCENT", value: 10, description: "10% off total booking" },
  LUXE500: { type: "FLAT", value: 500, description: "Flat ₹500 off" },
  LUXE1000: { type: "FLAT", value: 1000, description: "Flat ₹1000 off" },
  SPECIAL20: { type: "PERCENT", value: 20, description: "20% off special offer" },
};

export function validateCoupon(code: string, currentTotal: number): CouponValidationResult {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = VALID_COUPONS[normalizedCode];

  if (!coupon) {
    return {
      valid: false,
      code: normalizedCode,
      discount: 0,
      finalTotal: currentTotal,
      message: "Invalid or expired coupon code",
    };
  }

  let discount = 0;
  if (coupon.type === "PERCENT") {
    discount = Math.round((currentTotal * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }

  // Ensure discount does not exceed total
  discount = Math.min(discount, currentTotal);
  const finalTotal = Math.max(0, currentTotal - discount);

  return {
    valid: true,
    code: normalizedCode,
    discount,
    finalTotal,
    message: coupon.description,
  };
}
