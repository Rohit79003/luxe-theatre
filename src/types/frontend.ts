export interface Theater {
  id: number;
  name: string;
  basePrice: number;
  maxCapacity: number;
  screen: string;
  sound: string;
  createdAt: string;
  slots?: Slot[];
}

export interface Slot {
  id: number;
  time: string;
  theaterId: number;
  theaterName?: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
  isAvailable: boolean;
}

export interface AddOn {
  id: number;
  name: string;
  category: "CAKE" | "DECOR" | "GIFT";
  price: number;
  options?: string[] | Record<string, any> | null;
  createdAt: string;
}

export interface SelectedAddOn {
  addOnId: number;
  optionName: string;
  quantity: number;
  name?: string;
  price?: number;
  category?: "CAKE" | "DECOR" | "GIFT";
}

export interface CartItem {
  id: number;
  addOnId: number;
  addOnName?: string;
  category?: string;
  optionName: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: number;
  location: string;
  date: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  occasion: string;
  total: number;
  subtotal?: number;
  discount?: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  theater: {
    id: number;
    name: string;
    basePrice: number;
    screen?: string;
    sound?: string;
  };
  slot: {
    id: number;
    time: string;
  };
  cartItems: CartItem[];
  createdAt: string;
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

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discount: number;
  finalTotal: number;
  message?: string;
}

export interface PaymentResult {
  bookingId: number;
  paymentStatus: "PAID" | "FAILED";
  total: number;
  transactionId: string;
  message: string;
}

export interface BookingConfirmationResult {
  status: "CONFIRMED";
  booking: {
    id: number;
    location: string;
    date: string;
    guests: number;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    occasion: string;
    theater: {
      id: number;
      name: string;
      basePrice: number;
    };
    slot: {
      id: number;
      time: string;
    };
    cartItems: CartItem[];
    total: number;
    paymentStatus: string;
    receiptNumber: string;
    confirmedAt: string;
  };
}

export interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  preferredLocation: string;
  message: string;
}
