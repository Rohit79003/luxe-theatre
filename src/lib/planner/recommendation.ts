import { prisma } from "@/lib/prisma";
import { PlannerRequest, PlannerRecommendation, RecommendedAddOn } from "./types";
import { getOccasionRule } from "./rules";
import { calculateCandidateScore } from "./scoring";

export async function generatePlannerRecommendation(
  input: PlannerRequest
): Promise<PlannerRecommendation | null> {
  const { occasion, guests, budget } = input;

  // 1. Fetch valid theaters from database where capacity can hold guests
  const theaters = await prisma.theater.findMany({
    where: {
      maxCapacity: {
        gte: guests,
      },
    },
    orderBy: {
      basePrice: "asc",
    },
  });

  if (theaters.length === 0) {
    return null; // No theater can accommodate this guest count
  }

  // Filter theaters where base price alone exceeds budget
  const affordableTheaters = theaters.filter(
    (t) => Number(t.basePrice) <= budget
  );

  if (affordableTheaters.length === 0) {
    return null; // Budget too low even for cheapest suitable theater
  }

  // 2. Fetch all add-ons from database
  const dbAddOns = await prisma.addOn.findMany();
  const rule = getOccasionRule(occasion);

  let bestPackage: PlannerRecommendation | null = null;
  let highestScore = -1;

  for (const theater of affordableTheaters) {
    const basePriceNum = Number(theater.basePrice);
    let currentTotal = basePriceNum;
    const selectedAddOns: RecommendedAddOn[] = [];

    // Filter add-ons matching preferred categories for occasion
    for (const category of rule.preferredCategories) {
      const categoryAddOns = dbAddOns.filter((a) => a.category === category);
      if (categoryAddOns.length === 0) continue;

      // Pick cheapest matching option in category that fits remaining budget
      for (const addon of categoryAddOns) {
        const addonPrice = Number(addon.price);
        if (currentTotal + addonPrice <= budget) {
          // Extract option name from JSON or default
          let optionName = "Standard Option";
          if (addon.options && Array.isArray(addon.options) && addon.options.length > 0) {
            optionName = String(addon.options[0]);
          } else if (typeof addon.options === "object" && addon.options !== null) {
            optionName = (addon.options as any).default || addon.name;
          }

          selectedAddOns.push({
            id: addon.id,
            name: addon.name,
            category: addon.category as "CAKE" | "DECOR" | "GIFT",
            optionName,
            price: addonPrice,
          });
          currentTotal += addonPrice;
          break; // One item per category preferred
        }
      }
    }

    const score = calculateCandidateScore({
      theaterBasePrice: basePriceNum,
      maxCapacity: theater.maxCapacity,
      guests,
      totalCost: currentTotal,
      budget,
      addOnCount: selectedAddOns.length,
      hasPreferredCategories: selectedAddOns.length > 0,
    });

    const recommendation: PlannerRecommendation = {
      theater: {
        id: theater.id,
        name: theater.name,
        basePrice: basePriceNum,
        maxCapacity: theater.maxCapacity,
        screen: theater.screen,
        sound: theater.sound,
      },
      selectedAddOns,
      subtotal: currentTotal,
      total: currentTotal,
      remainingBudget: budget - currentTotal,
      recommendationReason: `Perfect match for ${guests} guests celebrating a ${occasion}. Includes ${theater.name} with ${theater.screen} screen and ${selectedAddOns.length} curated add-ons within your ₹${budget} budget.`,
      score,
    };

    if (score > highestScore) {
      highestScore = score;
      bestPackage = recommendation;
    }
  }

  return bestPackage;
}
