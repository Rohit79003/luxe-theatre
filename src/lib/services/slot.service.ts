import { prisma } from "@/lib/prisma";
import { SlotStatus } from "@prisma/client";

export interface SlotAvailabilityResult {
  id: number;
  time: string;
  theaterId: number;
  theaterName?: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
  isAvailable: boolean;
}

export async function getSlotsAvailability(
  dateStr?: string,
  theaterId?: number
): Promise<SlotAvailabilityResult[]> {
  const targetDate = dateStr ? new Date(dateStr) : undefined;

  const whereSlot: any = {};
  if (theaterId) {
    whereSlot.theaterId = theaterId;
  }

  const slots = await prisma.slot.findMany({
    where: whereSlot,
    include: {
      theater: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ theaterId: "asc" }, { id: "asc" }],
  });

  if (!targetDate) {
    return slots.map((slot) => ({
      id: slot.id,
      time: slot.time,
      theaterId: slot.theaterId,
      theaterName: slot.theater.name,
      status: slot.status as "AVAILABLE" | "BLOCKED",
      isAvailable: slot.status === SlotStatus.AVAILABLE,
    }));
  }

  // Fetch active bookings on targetDate
  const activeBookings = await prisma.booking.findMany({
    where: {
      date: targetDate,
      paymentStatus: { in: ["PENDING", "PAID"] },
      ...(theaterId ? { theaterId } : {}),
    },
    select: {
      theaterId: true,
      slotId: true,
    },
  });

  const bookedSlotMap = new Set(
    activeBookings.map((b) => `${b.theaterId}_${b.slotId}`)
  );

  return slots.map((slot) => {
    if (slot.status === SlotStatus.BLOCKED) {
      return {
        id: slot.id,
        time: slot.time,
        theaterId: slot.theaterId,
        theaterName: slot.theater.name,
        status: "BLOCKED",
        isAvailable: false,
      };
    }

    const isBooked = bookedSlotMap.has(`${slot.theaterId}_${slot.id}`);
    if (isBooked) {
      return {
        id: slot.id,
        time: slot.time,
        theaterId: slot.theaterId,
        theaterName: slot.theater.name,
        status: "BOOKED",
        isAvailable: false,
      };
    }

    return {
      id: slot.id,
      time: slot.time,
      theaterId: slot.theaterId,
      theaterName: slot.theater.name,
      status: "AVAILABLE",
      isAvailable: true,
    };
  });
}
