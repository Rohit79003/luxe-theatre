import { z } from "zod";

export const confirmBookingSchema = z.object({
  bookingId: z.number({ message: "bookingId is required" }).int().positive("bookingId must be a positive integer"),
});

export type ConfirmBookingInput = z.infer<typeof confirmBookingSchema>;
