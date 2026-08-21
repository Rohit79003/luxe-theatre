"use client";

import React, { useEffect, useState } from "react";
import { useBooking } from "@/context/booking-context";
import { fetchTheaters } from "@/lib/api";
import { Theater } from "@/types/frontend";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";

export const Step2Theater: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useBooking();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTheaters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTheaters();
      setTheaters(data);
      if (data.length > 0 && !state.theaterId) {
        updateState({ theaterId: data[0].id, theater: data[0] });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load theater catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheaters();
  }, []);

  const handleSelectTheater = (theater: Theater) => {
    updateState({
      theaterId: theater.id,
      theater: theater,
    });
  };

  const currentTheater = theaters.find((t) => t.id === state.theaterId) || state.theater;
  const isCapacityViolated = currentTheater ? state.guests > currentTheater.maxCapacity : false;
  const isNextDisabled = !state.theaterId || isCapacityViolated;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          Step 2: Choose Private Cinema Suite
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Select your private suite from our live PostgreSQL catalog.
        </p>
      </div>

      {loading ? (
        <Loader message="Fetching luxury suites and technical specifications..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadTheaters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theaters.map((theater) => {
            const isSelected = state.theaterId === theater.id;
            const cannotHoldGuests = state.guests > theater.maxCapacity;

            return (
              <Card
                key={theater.id}
                onClick={() => handleSelectTheater(theater)}
                className={`flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/10 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400"
                    : "hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Up to {theater.maxCapacity} Guests
                    </span>
                    {cannotHoldGuests && (
                      <span className="text-xs text-red-400 font-medium">
                        (Too small for {state.guests} guests)
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100 mb-2">{theater.name}</h3>

                  <div className="space-y-2 mb-6 text-xs text-zinc-400">
                    <p className="flex items-center gap-2">
                      <span className="text-amber-400">🖥</span> {theater.screen}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-amber-400">🔊</span> {theater.sound}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Base Rate</span>
                    <span className="text-xl font-extrabold text-amber-400">₹{theater.basePrice}</span>
                  </div>
                  <Button variant={isSelected ? "primary" : "outline"} size="sm">
                    {isSelected ? "Selected ✓" : "Select Suite"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {isCapacityViolated && (
        <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-300">
          ⚠️ Your guest count ({state.guests}) exceeds the maximum capacity ({currentTheater?.maxCapacity}) of {currentTheater?.name}. Please select a larger suite or reduce guest count.
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <Button variant="secondary" size="md" onClick={prevStep}>
          ← Back
        </Button>
        <Button variant="primary" size="md" disabled={isNextDisabled} onClick={nextStep}>
          Continue to Contact Details →
        </Button>
      </div>
    </div>
  );
};
