"use client";

import React, { useEffect, useState } from "react";
import { useBooking } from "@/context/booking-context";
import { fetchSlots } from "@/lib/api";
import { Slot } from "@/types/frontend";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";

export const Step1DateTime: React.FC = () => {
  const { state, updateState, nextStep } = useBooking();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = async () => {
    if (!state.date) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSlots(state.date, state.theaterId || undefined);
      setSlots(data);
    } catch (err: any) {
      setError(err.message || "Failed to load slots for selected date.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [state.date, state.theaterId]);

  const handleSelectSlot = (slot: Slot) => {
    if (!slot.isAvailable) return;
    updateState({
      slotId: slot.id,
      slotTime: slot.time,
      theaterId: slot.theaterId,
    });
  };

  const isNextDisabled = !state.date || !state.slotId;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          Step 1: Select Date & Time Slot
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Pick your preferred date to view real-time available screening slots in PostgreSQL database.
        </p>
      </div>

      <div className="max-w-xs">
        <Input
          label="Booking Date *"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={state.date}
          onChange={(e) => {
            updateState({ date: e.target.value, slotId: null, slotTime: "" });
          }}
        />
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
          Available Time Slots ({slots.filter((s) => s.isAvailable).length} Available)
        </h3>

        {loading ? (
          <Loader message="Checking slot availability against existing bookings..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadSlots} />
        ) : slots.length === 0 ? (
          <div className="p-8 bg-zinc-900/60 rounded-xl text-center text-sm text-zinc-400">
            No time slots found for this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const isSelected = state.slotId === slot.id;
              const isAvailable = slot.isAvailable;

              return (
                <div
                  key={slot.id}
                  onClick={() => handleSelectSlot(slot)}
                  className={`p-4 rounded-xl border transition-all ${
                    !isAvailable
                      ? "bg-zinc-950/40 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-60"
                      : isSelected
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400 cursor-pointer"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono">Slot #{slot.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        slot.status === "BOOKED"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : slot.status === "BLOCKED"
                          ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  <p className="text-base font-bold tracking-wide">{slot.time}</p>
                  {slot.theaterName && (
                    <p className="text-xs text-zinc-400 mt-1">{slot.theaterName}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-6 border-t border-zinc-800">
        <Button variant="primary" size="md" disabled={isNextDisabled} onClick={nextStep}>
          Continue to Theatre Selection →
        </Button>
      </div>
    </div>
  );
};
