import { prisma } from "@/lib/prisma";

export async function getAllTheaters() {
  const theaters = await prisma.theater.findMany({
    select: {
      id: true,
      name: true,
      basePrice: true,
      maxCapacity: true,
      screen: true,
      sound: true,
      createdAt: true,
    },
    orderBy: { id: "asc" },
  });

  return theaters.map((t) => ({
    ...t,
    basePrice: Number(t.basePrice),
  }));
}

export async function getTheaterById(id: number) {
  const theater = await prisma.theater.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      basePrice: true,
      maxCapacity: true,
      screen: true,
      sound: true,
      createdAt: true,
      slots: {
        select: {
          id: true,
          time: true,
          status: true,
        },
      },
    },
  });

  if (!theater) return null;

  return {
    ...theater,
    basePrice: Number(theater.basePrice),
  };
}
