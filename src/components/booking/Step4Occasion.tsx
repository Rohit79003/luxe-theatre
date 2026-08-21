"use client";

import React, { useState } from "react";
import { useBooking } from "@/context/booking-context";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const Step4Occasion: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useBooking();
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!state.occasion) {
      setError("Please select an occasion");
      return;
    }
    if (state.theater && state.guests > state.theater.maxCapacity) {
      setError(`Guest count exceeds selected suite capacity (${state.theater.maxCapacity})`);
      return;
    }
    setError(null);
    nextStep();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          Step 4: Occasion & Guest Details
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Tell us about your celebration so our lounge team can prepare your suite accordingly.
        </p>
      </div>

      <div className="max-w-xl space-y-6 bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-800">
        <Select
          label="Celebration Occasion *"
          value={state.occasion}
          onChange={(e) => updateState({ occasion: e.target.value })}
          options={[
            { label: "Birthday Extravaganza", value: "BIRTHDAY" },
            { label: "Romantic Anniversary", value: "ANNIVERSARY" },
            { label: "Marriage Proposal", value: "PROPOSAL" },
            { label: "Private Date Night", value: "DATE_NIGHT" },
            { label: "Movie Marathon / Gaming", value: "MOVIE_MARATHON" },
            { label: "Family Get-Together", value: "FAMILY_GETTOGETHER" },
          ]}
        />

        <Input
          label="Number of Attending Guests *"
          type="number"
          min={1}
          max={state.theater?.maxCapacity || 30}
          value={state.guests}
          onChange={(e) => updateState({ guests: Math.max(1, Number(e.target.value)) })}
          helperText={`Selected Suite (${state.theater?.name || "Suite"}) accommodates up to ${state.theater?.maxCapacity || 30} guests.`}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-300">
          ⚠️ {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <Button variant="secondary" size="md" onClick={prevStep}>
          ← Back
        </Button>
        <Button variant="primary" size="md" onClick={handleContinue}>
          Continue to Cake Options →
        </Button>
      </div>
    </div>
  );
};
