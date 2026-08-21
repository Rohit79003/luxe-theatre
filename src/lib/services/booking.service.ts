import { prisma } from "@/lib/prisma";
import { CreateBookingInput } from "@/lib/validations/booking";
import { validateCoupon } from "@/lib/services/coupon.service";
import { SlotStatus, Prisma } from "@prisma/client";

export interface BookingResult {
  id: number;
  location: string;
  date: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
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
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: string;
  cartItems: {
    id: number;
    addOnId: number;
    optionName: string;
    price: number;
    quantity: number;
  }[];
  createdAt: Date;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  const { theaterId, slotId, date: dateStr, guests, name, phone, email, occasion, location, addOns, couponCode } = input;

  // 1. Verify Theater exists
  const theater = await prisma.theater.findUnique({
    where: { id: theaterId },
  });

  if (!theater) {
    throw new Error(`Theater with ID ${theaterId} not found`);
  }

  // 2. Verify Capacity
  if (guests > theater.maxCapacity) {
    throw new Error(`Guest count (${guests}) exceeds theater maximum capacity (${theater.maxCapacity})`);
  }

  // 3. Verify Slot exists and belongs to Theater
  const slot = await prisma.slot.findFirst({
    where: {
      id: slotId,
      theaterId: theaterId,
    },
  });

  if (!slot) {
    throw new Error(`Slot with ID ${slotId} is not valid for theater ${theaterId}`);
  }

  if (slot.status === SlotStatus.BLOCKED) {
    throw new Error(`Slot '${slot.time}' is currently blocked/unavailable`);
  }

  // 4. Normalize date
  const bookingDate = new Date(dateStr);
  if (isNaN(bookingDate.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  // 5. Verify Slot Availability for given date (Double booking check)
  const existingActiveBooking = await prisma.booking.findFirst({
    where: {
      theaterId,
      slotId,
      date: bookingDate,
      paymentStatus: {
        in: ["PENDING", "PAID"],
      },
    },
  });

  if (existingActiveBooking) {
    throw new Error(`Slot '${slot.time}' is already booked for date ${dateStr}`);
  }

  // 6. Fetch add-ons from PostgreSQL database and build cart item data
  let addOnsSubtotal = 0;
  const cartItemsToCreate: { addOnId: number; optionName: string; price: number; quantity: number }[] = [];

  if (addOns && addOns.length > 0) {
    const addOnIds = addOns.map((a) => a.addOnId);
    const dbAddOns = await prisma.addOn.findMany({
      where: { id: { in: addOnIds } },
    });

    const addOnMap = new Map(dbAddOns.map((a) => [a.id, a]));

    for (const item of addOns) {
      const dbAddOn = addOnMap.get(item.addOnId);
      if (!dbAddOn) {
        throw new Error(`AddOn with ID ${item.addOnId} not found`);
      }
      const priceNum = Number(dbAddOn.price);
      const itemTotal = priceNum * item.quantity;
      addOnsSubtotal += itemTotal;

      cartItemsToCreate.push({
        addOnId: dbAddOn.id,
        optionName: item.optionName,
        price: priceNum,
        quantity: item.quantity,
      });
    }
  }

  const theaterBasePriceNum = Number(theater.basePrice);
  const subtotal = theaterBasePriceNum + addOnsSubtotal;

  // 7. Calculate coupon discount if applicable
  let discount = 0;
  let finalTotal = subtotal;

  if (couponCode && couponCode.trim().length > 0) {
    const couponResult = validateCoupon(couponCode, subtotal);
    if (couponResult.valid) {
      discount = couponResult.discount;
      finalTotal = couponResult.finalTotal;
    }
  }

  // 8. Execute Database Transaction to create Booking & CartItems safely
  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        location: location || "Indiranagar, Bangalore",
        date: bookingDate,
        guests,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        occasion: occasion.trim(),
        total: new Prisma.Decimal(finalTotal),
        paymentStatus: "PENDING",
        theaterId,
        slotId,
        cartItems: {
          create: cartItemsToCreate.map((item) => ({
            addOnId: item.addOnId,
            optionName: item.optionName,
            price: new Prisma.Decimal(item.price),
            quantity: item.quantity,
          })),
        },
      },
      include: {
        theater: { select: { id: true, name: true, basePrice: true } },
        slot: { select: { id: true, time: true } },
        cartItems: true,
      },
    });

    return newBooking;
  });

  return {
    id: booking.id,
    location: booking.location,
    date: dateStr,
    guests: booking.guests,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    occasion: booking.occasion,
    theater: {
      id: booking.theater.id,
      name: booking.theater.name,
      basePrice: Number(booking.theater.basePrice),
    },
    slot: {
      id: booking.slot.id,
      time: booking.slot.time,
    },
    subtotal,
    discount,
    total: Number(booking.total),
    paymentStatus: booking.paymentStatus,
    cartItems: booking.cartItems.map((ci) => ({
      id: ci.id,
      addOnId: ci.addOnId,
      optionName: ci.optionName,
      price: Number(ci.price),
      quantity: ci.quantity,
    })),
    createdAt: booking.createdAt,
  };
}

export async function getBookingById(id: number) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      theater: { select: { id: true, name: true, basePrice: true, screen: true, sound: true } },
      slot: { select: { id: true, time: true } },
      cartItems: {
        include: {
          addOn: { select: { id: true, name: true, category: true } },
        },
      },
    },
  });

  if (!booking) return null;

  return {
    id: booking.id,
    location: booking.location,
    date: booking.date.toISOString().split("T")[0],
    guests: booking.guests,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    occasion: booking.occasion,
    total: Number(booking.total),
    paymentStatus: booking.paymentStatus,
    theater: {
      ...booking.theater,
      basePrice: Number(booking.theater.basePrice),
    },
    slot: booking.slot,
    cartItems: booking.cartItems.map((ci) => ({
      id: ci.id,
      addOnId: ci.addOnId,
      addOnName: ci.addOn.name,
      category: ci.addOn.category,
      optionName: ci.optionName,
      price: Number(ci.price),
      quantity: ci.quantity,
    })),
    createdAt: booking.createdAt,
  };
}
