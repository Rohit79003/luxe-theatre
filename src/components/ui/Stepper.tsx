import React from "react";

export interface StepperStep {
  number: number;
  title: string;
}

export const BOOKING_STEPS: StepperStep[] = [
  { number: 1, title: "Date & Time" },
  { number: 2, title: "Theatre" },
  { number: 3, title: "Contact" },
  { number: 4, title: "Occasion" },
  { number: 5, title: "Cakes" },
  { number: 6, title: "Decor" },
  { number: 7, title: "Gifts" },
  { number: 8, title: "Payment" },
  { number: 9, title: "Confirm" },
];

export interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-zinc-900/90 border-b border-zinc-800 py-3 px-4 sm:px-8 overflow-x-auto scrollbar-none sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[700px] lg:min-w-0">
        {BOOKING_STEPS.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              <div
                onClick={() => isCompleted && onStepClick?.(step.number)}
                className={`flex items-center gap-2 cursor-pointer group transition-all ${
                  isCurrent
                    ? "text-amber-400 font-semibold"
                    : isCompleted
                    ? "text-zinc-300 hover:text-white"
                    : "text-zinc-600 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-zinc-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40"
                      : isCompleted
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700/50"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs uppercase tracking-wider whitespace-nowrap hidden sm:inline">
                  {step.title}
                </span>
              </div>
              {idx < BOOKING_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-1 sm:mx-2 min-w-[12px] transition-colors ${
                    step.number < currentStep ? "bg-amber-500/50" : "bg-zinc-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
