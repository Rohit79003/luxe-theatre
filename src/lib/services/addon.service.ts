import { prisma } from "@/lib/prisma";
import { AddOnCategory } from "@prisma/client";

export async function getAddOns(category?: string) {
  const where: any = {};
  if (category && Object.values(AddOnCategory).includes(category.toUpperCase() as AddOnCategory)) {
    where.category = category.toUpperCase() as AddOnCategory;
  }

  const addOns = await prisma.addOn.findMany({
    where,
    orderBy: [{ category: "asc" }, { id: "asc" }],
  });

  return addOns.map((addon) => ({
    ...addon,
    price: Number(addon.price),
  }));
}

export async function getAddOnById(id: number) {
  const addOn = await prisma.addOn.findUnique({
    where: { id },
  });

  if (!addOn) return null;

  return {
    ...addOn,
    price: Number(addOn.price),
  };
}
