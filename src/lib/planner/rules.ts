export const OCCASION_ADDON_RULES: Record<string, { preferredCategories: ("CAKE" | "DECOR" | "GIFT")[]; keywords: string[] }> = {
  BIRTHDAY: {
    preferredCategories: ["CAKE", "DECOR", "GIFT"],
    keywords: ["birthday", "cake", "balloon", "celebration"],
  },
  ANNIVERSARY: {
    preferredCategories: ["DECOR", "CAKE", "GIFT"],
    keywords: ["romantic", "anniversary", "rose", "luxury", "wine"],
  },
  PROPOSAL: {
    preferredCategories: ["DECOR", "GIFT", "CAKE"],
    keywords: ["proposal", "romantic", "luxury", "floral", "champagne"],
  },
  DATE_NIGHT: {
    preferredCategories: ["DECOR", "CAKE"],
    keywords: ["cozy", "romantic", "candlelight"],
  },
  MOVIE_MARATHON: {
    preferredCategories: ["GIFT", "CAKE"],
    keywords: ["snack", "popcorn", "unlimited"],
  },
  FAMILY_GETTOGETHER: {
    preferredCategories: ["CAKE", "GIFT"],
    keywords: ["family", "grand", "deluxe"],
  },
};

export function getOccasionRule(occasion: string) {
  const normalized = occasion.toUpperCase().replace(/\s+/g, "_");
  return (
    OCCASION_ADDON_RULES[normalized] || {
      preferredCategories: ["CAKE", "DECOR", "GIFT"],
      keywords: ["standard", "deluxe"],
    }
  );
}
