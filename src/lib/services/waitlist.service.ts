import { prisma } from "@/lib/prisma";
import { CreateWaitlistInput } from "@/lib/validations/waitlist";

export async function addWaitlistEntry(data: CreateWaitlistInput) {
  const entry = await prisma.waitlist.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      preferredLocation: data.preferredLocation.trim(),
      notes: data.notes?.trim() || null,
    },
  });

  return entry;
}
