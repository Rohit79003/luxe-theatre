import { z } from "zod";

export const paymentSchema = z.object({
  bookingId: z.number({ message: "bookingId is required" }).int().positive("bookingId must be a positive integer"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
