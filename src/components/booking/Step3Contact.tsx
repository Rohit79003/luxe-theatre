"use client";

import React, { useState } from "react";
import { useBooking } from "@/context/booking-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const Step3Contact: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!state.name || state.name.trim().length < 2) {
      errs.name = "Full name is required (min 2 characters)";
    }
    if (!state.phone || state.phone.trim().length < 10) {
      errs.phone = "Valid phone number is required (min 10 digits)";
    }
    if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      errs.email = "Valid email address is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
          Step 3: Contact & Booking Confirmation Details
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Provide your contact information for reservation receipts and suite access confirmation.
        </p>
      </div>

      <div className="max-w-xl space-y-6 bg-zinc-900/60 p-6 sm:p-8 rounded-2xl border border-zinc-800">
        <Input
          label="Primary Guest Name *"
          placeholder="e.g. Alexander Wright"
          value={state.name}
          onChange={(e) => updateState({ name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Phone Number *"
          placeholder="e.g. +91 98765 43210"
          value={state.phone}
          onChange={(e) => updateState({ phone: e.target.value })}
          error={errors.phone}
          helperText="SMS confirmation & valet entry details will be sent here."
        />

        <Input
          label="Email Address *"
          type="email"
          placeholder="e.g. alexander@example.com"
          value={state.email}
          onChange={(e) => updateState({ email: e.target.value })}
          error={errors.email}
          helperText="Receipt & tax invoice will be emailed upon payment."
        />
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <Button variant="secondary" size="md" onClick={prevStep}>
          ← Back
        </Button>
        <Button variant="primary" size="md" onClick={handleContinue}>
          Continue to Occasion Specifics →
        </Button>
      </div>
    </div>
  );
};
