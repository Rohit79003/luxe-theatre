export interface PlannerRequest {
  occasion: string;
  guests: number;
  budget: number;
}

export interface RecommendedAddOn {
  id: number;
  name: string;
  category: "CAKE" | "DECOR" | "GIFT";
  optionName: string;
  price: number;
}

export interface PlannerRecommendation {
  theater: {
    id: number;
    name: string;
    basePrice: number;
    maxCapacity: number;
    screen: string;
    sound: string;
  };
  selectedAddOns: RecommendedAddOn[];
  subtotal: number;
  total: number;
  remainingBudget: number;
  recommendationReason: string;
  score: number;
}
