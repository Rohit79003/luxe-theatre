import {
  Theater,
  Slot,
  AddOn,
  PlannerRecommendation,
  CouponValidationResult,
  Booking,
  PaymentResult,
  BookingConfirmationResult,
  WaitlistEntry,
  SelectedAddOn,
} from "@/types/frontend";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const errorMsg = data.message || `API request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    (error as any).errors = data.errors;
    throw error;
  }
  return data.data as T;
}

export async function fetchTheaters(): Promise<Theater[]> {
  const res = await fetch("/api/theaters", { cache: "no-store" });
  return handleResponse<Theater[]>(res);
}

export async function fetchTheaterById(id: number): Promise<Theater> {
  const res = await fetch(`/api/theaters/${id}`, { cache: "no-store" });
  return handleResponse<Theater>(res);
}

export async function fetchAddOns(category?: "CAKE" | "DECOR" | "GIFT"): Promise<AddOn[]> {
  const url = category ? `/api/addons?category=${category}` : "/api/addons";
  const res = await fetch(url, { cache: "no-store" });
  return handleResponse<AddOn[]>(res);
}

export async function fetchSlots(date?: string, theaterId?: number): Promise<Slot[]> {
  const params = new URLSearchParams();
  if (date) params.append("date", date);
  if (theaterId) params.append("theaterId", theaterId.toString());

  const res = await fetch(`/api/slots?${params.toString()}`, { cache: "no-store" });
  return handleResponse<Slot[]>(res);
}

export async function requestPlannerRecommendation(
  occasion: string,
  guests: number,
  budget: number
): Promise<PlannerRecommendation> {
  const res = await fetch("/api/planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ occasion, guests, budget }),
  });
  return handleResponse<PlannerRecommendation>(res);
}

export async function validateCoupon(
  code: string,
  total: number
): Promise<CouponValidationResult> {
  const res = await fetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, total }),
  });
  return handleResponse<CouponValidationResult>(res);
}

export interface CreateBookingPayload {
  theaterId: number;
  slotId: number;
  date: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  occasion: string;
  location?: string;
  addOns?: SelectedAddOn[];
  couponCode?: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Booking>(res);
}

export async function fetchBookingById(id: number): Promise<Booking> {
  const res = await fetch(`/api/bookings/${id}`, { cache: "no-store" });
  return handleResponse<Booking>(res);
}

export async function processPayment(bookingId: number): Promise<PaymentResult> {
  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });
  return handleResponse<PaymentResult>(res);
}

export async function confirmBooking(bookingId: number): Promise<BookingConfirmationResult> {
  const res = await fetch("/api/booking/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId }),
  });
  return handleResponse<BookingConfirmationResult>(res);
}

export interface WaitlistPayload {
  name: string;
  email: string;
  phone: string;
  preferredLocation: string;
  notes?: string;
}

export async function submitWaitlist(payload: WaitlistPayload): Promise<WaitlistEntry> {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<WaitlistEntry>(res);
}
