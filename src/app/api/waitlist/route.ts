import { NextRequest } from "next/server";
import { createWaitlistSchema } from "@/lib/validations/waitlist";
import { addWaitlistEntry } from "@/lib/services/waitlist.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = createWaitlistSchema.safeParse(body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.flatten().fieldErrors;
      return errorResponse("Validation failed for waitlist submission", formattedErrors, 400);
    }

    const entry = await addWaitlistEntry(parseResult.data);
    return successResponse(
      {
        id: entry.id,
        name: entry.name,
        email: entry.email,
        preferredLocation: entry.preferredLocation,
        message: "Successfully added to Luxe Screens waitlist",
      },
      201
    );
  } catch (error: any) {
    console.error("POST /api/waitlist error:", error);
    return errorResponse(error.message || "Failed to submit waitlist entry", null, 500);
  }
}
