import { z } from "zod";

export const validateCouponSchema = z.object({
  code: z.string({ message: "Coupon code is required" }).min(1, "Coupon code cannot be empty"),
  total: z.number({ message: "Current total is required" }).positive("Total must be greater than 0"),
});

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
