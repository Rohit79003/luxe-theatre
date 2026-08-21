"use client";

import React, { useState } from "react";
import { useBooking } from "@/context/booking-context";
import { validateCoupon, createBooking, processPayment, confirmBooking } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";

export const Step8Payment: React.FC = () => {
  const { state, updateState, setCoupon, calculateSubtotal, calculateTotal, nextStep, prevStep } = useBooking();

  const [inputCoupon, setInputCoupon] = useState(state.couponCode);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const subtotal = calculateSubtotal();
  const finalTotal = calculateTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponMessage(null);

    try {
      const result = await validateCoupon(inputCoupon.trim(), subtotal);
      if (result.valid) {
        setCoupon(result.code, result.discount);
        setCouponMessage(`Coupon Applied: ${result.message} (-₹${result.discount})`);
      } else {
        setCouponError(result.message || "Invalid coupon code");
      }
    } catch (err: any) {
      setCouponError(err.message || "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProcessSimulatedPayment = async () => {
    if (!state.theaterId || !state.slotId || !state.date) {
      setPaymentError("Missing date, slot, or theater selection.");
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      // 1. Create Booking in database (transaction safe)
      const bookingData = await createBooking({
        theaterId: state.theaterId,
        slotId: state.slotId,
        date: state.date,
        guests: state.guests,
        name: state.name,
        phone: state.phone,
        email: state.email,
        occasion: state.occasion,
        addOns: state.selectedAddOns.map((item) => ({
          addOnId: item.addOnId,
          optionName: item.optionName,
          quantity: item.quantity || 1,
        })),
        couponCode: state.couponCode || undefined,
      });

      updateState({ createdBooking: bookingData });

      // 2. Process Simulated Payment
      await processPayment(bookingData.id);

      // 3. Fetch Confirmation Details Receipt
      const receipt = await confirmBooking(bookingData.id);
      updateState({ confirmedReceipt: receipt.booking });

      // 4. Move to Step 9 (Confirmation)
      nextStep();
    } catch (err: any) {
      setPaymentError(err.message || "Payment simulation failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          Step 8: Payment & Booking Order Summary
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Review your reservation breakdown, apply discounts, and complete your simulated payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Itemization */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-4 border-b border-zinc-800 pb-3">
              Reservation Summary
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-xs text-zinc-300">
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block">Screening Suite</span>
                <span className="font-bold text-amber-400 text-sm">{state.theater?.name || "Suite"}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block">Date & Time</span>
                <span className="font-semibold text-zinc-200">{state.date} ({state.slotTime})</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block">Guests & Occasion</span>
                <span className="font-semibold text-zinc-200">{state.guests} Guests ({state.occasion})</span>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Itemized Line Items
            </h4>

            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">{state.theater?.name} (Base Rate)</span>
                <span className="font-bold text-zinc-100">₹{state.theater?.basePrice || 0}</span>
              </div>

              {state.selectedAddOns.map((item) => (
                <div key={item.addOnId} className="flex items-center justify-between text-xs text-zinc-400">
                  <span>
                    {item.name} <span className="text-zinc-500">({item.optionName})</span>
                  </span>
                  <span className="font-semibold text-amber-300">₹{(item.price || 0) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Coupon Input Box */}
          <Card className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Apply Promo / Coupon Code
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-3">
              <Input
                placeholder="Try LUXE500, LUXE10, SPECIAL20..."
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                className="font-mono uppercase"
              />
              <Button variant="outline" size="md" type="submit" isLoading={couponLoading}>
                Apply Code
              </Button>
            </form>
            {couponMessage && (
              <p className="text-xs text-emerald-400 font-medium mt-2">✓ {couponMessage}</p>
            )}
            {couponError && (
              <p className="text-xs text-red-400 font-medium mt-2">⚠️ {couponError}</p>
            )}
          </Card>
        </div>

        {/* Right Column: Total & Payment Box */}
        <div>
          <Card className="p-6 border-amber-500/30 gold-border-glow space-y-6">
            <h3 className="text-lg font-bold text-zinc-100 border-b border-zinc-800 pb-3">
              Payment Calculation
            </h3>

            <div className="space-y-2 text-sm text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-zinc-200">₹{subtotal}</span>
              </div>
              {state.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount ({state.couponCode}):</span>
                  <span>-₹{state.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-extrabold text-amber-400 pt-3 border-t border-zinc-800">
                <span>Final Amount:</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <p className="font-semibold text-zinc-300">⚡ Simulated Gateway Active</p>
              <p>No actual credit card or real money will be charged. This uses our backend payment simulation module.</p>
            </div>

            {paymentError && <ErrorState message={paymentError} />}

            {paymentProcessing ? (
              <Loader message="Processing simulated payment & generating receipt..." />
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-xl shadow-amber-500/20"
                onClick={handleProcessSimulatedPayment}
              >
                Pay & Confirm Booking ₹{finalTotal}
              </Button>
            )}
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <Button variant="secondary" size="md" onClick={prevStep} disabled={paymentProcessing}>
          ← Back
        </Button>
      </div>
    </div>
  );
};
