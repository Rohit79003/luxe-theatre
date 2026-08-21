import { z } from "zod";

export const selectedAddOnSchema = z.object({
  addOnId: z.number({ message: "addOnId must be a number" }).int().positive("addOnId must be positive"),
  optionName: z.string({ message: "Option name is required" }).min(1, "Option name is required"),
  quantity: z.number().int().positive("Quantity must be at least 1").default(1),
});

export const createBookingSchema = z.object({
  theaterId: z.number({ message: "theaterId is required" }).int().positive("theaterId must be positive"),
  slotId: z.number({ message: "slotId is required" }).int().positive("slotId must be positive"),
  date: z.string({ message: "date is required" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  guests: z.number({ message: "guests count is required" }).int().positive("Guest count must be at least 1"),
  name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
  phone: z.string({ message: "Phone is required" }).min(10, "Valid phone number is required"),
  email: z.string({ message: "Email is required" }).email("Valid email address is required"),
  occasion: z.string({ message: "Occasion is required" }).min(1, "Occasion is required"),
  location: z.string().optional().default("Indiranagar, Bangalore"),
  addOns: z.array(selectedAddOnSchema).optional().default([]),
  couponCode: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
