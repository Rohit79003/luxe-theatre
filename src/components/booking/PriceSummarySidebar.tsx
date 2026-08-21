"use client";

import React from "react";
import { useBooking } from "@/context/booking-context";
import { Card } from "@/components/ui/Card";

export const PriceSummarySidebar: React.FC = () => {
  const { state, calculateSubtotal, calculateTotal } = useBooking();
  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <Card className="sticky top-28 border-amber-500/20 shadow-xl space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
          Booking Summary
        </span>
        <h3 className="text-xl font-black text-zinc-100 mt-1">
          {state.theater?.name || "Select Suite"}
        </h3>
      </div>

      <div className="space-y-3 text-xs text-zinc-300">
        <div className="flex justify-between border-b border-zinc-800/60 pb-2">
          <span className="text-zinc-500">Date:</span>
          <span className="font-semibold text-zinc-100">{state.date || "Not selected"}</span>
        </div>

        <div className="flex justify-between border-b border-zinc-800/60 pb-2">
          <span className="text-zinc-500">Time Slot:</span>
          <span className="font-semibold text-zinc-100">{state.slotTime || "Not selected"}</span>
        </div>

        <div className="flex justify-between border-b border-zinc-800/60 pb-2">
          <span className="text-zinc-500">Guests & Occasion:</span>
          <span className="font-semibold text-zinc-100">
            {state.guests} Guests ({state.occasion})
          </span>
        </div>

        <div className="flex justify-between border-b border-zinc-800/60 pb-2">
          <span className="text-zinc-500">Suite Base Rate:</span>
          <span className="font-bold text-zinc-100">₹{state.theater?.basePrice || 0}</span>
        </div>

        {/* Selected Addons */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-2">
            Selected Add-Ons ({state.selectedAddOns.length})
          </span>
          {state.selectedAddOns.length === 0 ? (
            <p className="text-[11px] text-zinc-500 italic">No add-ons selected yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {state.selectedAddOns.map((item) => (
                <div key={item.addOnId} className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-300 truncate max-w-[140px]">{item.name}</span>
                  <span className="text-amber-300 font-semibold font-mono">₹{(item.price || 0) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="pt-4 border-t border-zinc-800 space-y-2">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Subtotal:</span>
          <span className="font-bold text-zinc-200">₹{subtotal}</span>
        </div>

        {state.discount > 0 && (
          <div className="flex justify-between text-xs text-emerald-400 font-semibold">
            <span>Discount ({state.couponCode}):</span>
            <span>-₹{state.discount}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-black text-amber-400 pt-2 border-t border-zinc-800/80">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>
    </Card>
  );
};
