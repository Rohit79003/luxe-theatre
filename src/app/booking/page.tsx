"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingProvider, useBooking } from "@/context/booking-context";
import { Stepper } from "@/components/ui/Stepper";
import { PriceSummarySidebar } from "@/components/booking/PriceSummarySidebar";
import { Step1DateTime } from "@/components/booking/Step1DateTime";
import { Step2Theater } from "@/components/booking/Step2Theater";
import { Step3Contact } from "@/components/booking/Step3Contact";
import { Step4Occasion } from "@/components/booking/Step4Occasion";
import { Step5Cakes } from "@/components/booking/Step5Cakes";
import { Step6Decor } from "@/components/booking/Step6Decor";
import { Step7Gifts } from "@/components/booking/Step7Gifts";
import { Step8Payment } from "@/components/booking/Step8Payment";
import { Step9Confirmation } from "@/components/booking/Step9Confirmation";

function BookingEngineContent() {
  const { state, updateState, goToStep } = useBooking();
  const searchParams = useSearchParams();

  // Pre-fill state from URL params if coming from Gallery or AI Planner
  useEffect(() => {
    const theaterIdParam = searchParams.get("theaterId");
    const guestsParam = searchParams.get("guests");
    const occasionParam = searchParams.get("occasion");

    const updates: any = {};
    if (theaterIdParam) updates.theaterId = Number(theaterIdParam);
    if (guestsParam) updates.guests = Number(guestsParam);
    if (occasionParam) updates.occasion = occasionParam;

    if (Object.keys(updates).length > 0) {
      updateState(updates);
    }
  }, [searchParams]);

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1DateTime />;
      case 2:
        return <Step2Theater />;
      case 3:
        return <Step3Contact />;
      case 4:
        return <Step4Occasion />;
      case 5:
        return <Step5Cakes />;
      case 6:
        return <Step6Decor />;
      case 7:
        return <Step7Gifts />;
      case 8:
        return <Step8Payment />;
      case 9:
        return <Step9Confirmation />;
      default:
        return <Step1DateTime />;
    }
  };

  const showSidebar = state.currentStep < 9;

  return (
    <div className="flex flex-col w-full bg-zinc-950 text-zinc-100 min-h-screen">
      {/* 9-Step Progress Stepper */}
      <Stepper currentStep={state.currentStep} onStepClick={goToStep} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className={showSidebar ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "w-full"}>
          <div className={showSidebar ? "lg:col-span-2" : "w-full"}>
            {renderStep()}
          </div>

          {showSidebar && (
            <div className="hidden lg:block">
              <PriceSummarySidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <BookingProvider>
      <Suspense fallback={<div className="p-12 text-center text-zinc-400">Loading Booking Engine...</div>}>
        <BookingEngineContent />
      </Suspense>
    </BookingProvider>
  );
}
