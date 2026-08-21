import { prisma } from "@/lib/prisma";

export interface PaymentProcessResult {
  bookingId: number;
  paymentStatus: "PAID" | "FAILED";
  total: number;
  transactionId: string;
  message: string;
}

export async function processPayment(bookingId: number): Promise<PaymentProcessResult> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error(`Booking with ID ${bookingId} not found`);
  }

  if (booking.paymentStatus === "PAID") {
    throw new Error(`Booking #${bookingId} has already been paid`);
  }

  // Simulate payment processing (success)
  const transactionId = `SIM_TXN_${Date.now()}_${bookingId}`;

  const updatedBooking = await prisma.$transaction(async (tx) => {
    return await tx.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "PAID",
      },
    });
  });

  return {
    bookingId: updatedBooking.id,
    paymentStatus: updatedBooking.paymentStatus as "PAID",
    total: Number(updatedBooking.total),
    transactionId,
    message: "Payment processed successfully (Simulated)",
  };
}
