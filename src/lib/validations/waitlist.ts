import { z } from "zod";

export const createWaitlistSchema = z.object({
  name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
  email: z.string({ message: "Email is required" }).email("Valid email address is required"),
  phone: z.string({ message: "Phone is required" }).min(10, "Valid phone number is required"),
  preferredLocation: z.string({ message: "Preferred location is required" }).min(2, "Preferred location is required"),
  notes: z.string().optional(),
});

export type CreateWaitlistInput = z.infer<typeof createWaitlistSchema>;
