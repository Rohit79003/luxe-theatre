import { z } from "zod";

export const plannerSchema = z.object({
  occasion: z.string({ message: "Occasion is required" }).min(1, "Occasion cannot be empty"),
  guests: z.number({ message: "Guest count is required" }).int().positive("Guest count must be at least 1"),
  budget: z.number({ message: "Budget is required" }).positive("Budget must be greater than 0"),
});

export type PlannerInput = z.infer<typeof plannerSchema>;
