"use client";

import React, { useEffect, useState } from "react";
import { useBooking } from "@/context/booking-context";
import { fetchAddOns } from "@/lib/api";
import { AddOn } from "@/types/frontend";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";

export const Step6Decor: React.FC = () => {
  const { state, addOrUpdateAddOn, removeAddOn, nextStep, prevStep } = useBooking();
  const [decors, setDecors] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const loadDecors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAddOns("DECOR");
      setDecors(data);

      const defaultOpts: Record<number, string> = {};
      data.forEach((decor) => {
        if (Array.isArray(decor.options) && decor.options.length > 0) {
          defaultOpts[decor.id] = String(decor.options[0]);
        } else {
          defaultOpts[decor.id] = "Standard Theme Setup";
        }
      });
      setSelectedOptions(defaultOpts);
    } catch (err: any) {
      setError(err.message || "Failed to load decor options.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecors();
  }, []);

  const handleToggleDecor = (decor: AddOn) => {
    const existing = state.selectedAddOns.find((item) => item.addOnId === decor.id);
    if (existing) {
      removeAddOn(decor.id);
    } else {
      const optionName = selectedOptions[decor.id] || "Standard Theme";
      addOrUpdateAddOn(decor.id, optionName, decor.price, decor.name, "DECOR", 1);
    }
  };

  const handleOptionChange = (decor: AddOn, optionName: string) => {
    setSelectedOptions((prev) => ({ ...prev, [decor.id]: optionName }));
    const existing = state.selectedAddOns.find((item) => item.addOnId === decor.id);
    if (existing) {
      addOrUpdateAddOn(decor.id, optionName, decor.price, decor.name, "DECOR", 1);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Step 6: Luxury Occasion Decor
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Elevate your suite with candlelight, rose petals, neon signs, or proposal arches.
          </p>
        </div>
        <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          (Optional Step)
        </span>
      </div>

      {loading ? (
        <Loader message="Fetching luxury decor setups from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadDecors} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {decors.map((decor) => {
            const selectedItem = state.selectedAddOns.find((item) => item.addOnId === decor.id);
            const isSelected = !!selectedItem;
            const decorOptionsList = Array.isArray(decor.options) ? (decor.options as string[]) : [];

            return (
              <Card
                key={decor.id}
                className={`flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400"
                    : "hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Luxury Decor
                    </span>
                    <span className="text-lg font-black text-amber-400">₹{decor.price}</span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 mb-4">{decor.name}</h3>

                  {decorOptionsList.length > 0 && (
                    <div className="mb-4">
                      <Select
                        label="Select Theme / Style"
                        value={selectedOptions[decor.id] || decorOptionsList[0]}
                        onChange={(e) => handleOptionChange(decor, e.target.value)}
                        options={decorOptionsList.map((opt) => ({ label: opt, value: opt }))}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleToggleDecor(decor)}
                  >
                    {isSelected ? "Selected ✓ (Click to Remove)" : "Add Decor +₹" + decor.price}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <Button variant="secondary" size="md" onClick={prevStep}>
          ← Back
        </Button>
        <Button variant="primary" size="md" onClick={nextStep}>
          Continue to Gift Hampers →
        </Button>
      </div>
    </div>
  );
};
