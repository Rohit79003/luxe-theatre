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

export const Step5Cakes: React.FC = () => {
  const { state, addOrUpdateAddOn, removeAddOn, nextStep, prevStep } = useBooking();
  const [cakes, setCakes] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected Option map per cake ID
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const loadCakes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAddOns("CAKE");
      setCakes(data);

      // Set default options
      const defaultOpts: Record<number, string> = {};
      data.forEach((cake) => {
        if (Array.isArray(cake.options) && cake.options.length > 0) {
          defaultOpts[cake.id] = String(cake.options[0]);
        } else {
          defaultOpts[cake.id] = "Standard Cake Option";
        }
      });
      setSelectedOptions(defaultOpts);
    } catch (err: any) {
      setError(err.message || "Failed to load cake offerings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCakes();
  }, []);

  const handleToggleCake = (cake: AddOn) => {
    const existing = state.selectedAddOns.find((item) => item.addOnId === cake.id);
    if (existing) {
      removeAddOn(cake.id);
    } else {
      const optionName = selectedOptions[cake.id] || "Standard Option";
      addOrUpdateAddOn(cake.id, optionName, cake.price, cake.name, "CAKE", 1);
    }
  };

  const handleOptionChange = (cake: AddOn, optionName: string) => {
    setSelectedOptions((prev) => ({ ...prev, [cake.id]: optionName }));
    const existing = state.selectedAddOns.find((item) => item.addOnId === cake.id);
    if (existing) {
      addOrUpdateAddOn(cake.id, optionName, cake.price, cake.name, "CAKE", existing.quantity || 1);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Step 5: Gourmet Celebration Cakes
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Choose an artisanal cake prepared freshly for your screening.
          </p>
        </div>
        <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          (Optional Step)
        </span>
      </div>

      {loading ? (
        <Loader message="Loading fresh artisanal cake menu from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCakes} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cakes.map((cake) => {
            const selectedItem = state.selectedAddOns.find((item) => item.addOnId === cake.id);
            const isSelected = !!selectedItem;
            const cakeOptionsList = Array.isArray(cake.options) ? (cake.options as string[]) : [];

            return (
              <Card
                key={cake.id}
                className={`flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400"
                    : "hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Gourmet Cake
                    </span>
                    <span className="text-lg font-black text-amber-400">₹{cake.price}</span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 mb-4">{cake.name}</h3>

                  {cakeOptionsList.length > 0 && (
                    <div className="mb-4">
                      <Select
                        label="Select Variant / Weight"
                        value={selectedOptions[cake.id] || cakeOptionsList[0]}
                        onChange={(e) => handleOptionChange(cake, e.target.value)}
                        options={cakeOptionsList.map((opt) => ({ label: opt, value: opt }))}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleToggleCake(cake)}
                  >
                    {isSelected ? "Selected ✓ (Click to Remove)" : "Add Cake +₹" + cake.price}
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
          Continue to Decor Options →
        </Button>
      </div>
    </div>
  );
};
