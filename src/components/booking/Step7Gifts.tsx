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

export const Step7Gifts: React.FC = () => {
  const { state, addOrUpdateAddOn, removeAddOn, nextStep, prevStep } = useBooking();
  const [gifts, setGifts] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const loadGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAddOns("GIFT");
      setGifts(data);

      const defaultOpts: Record<number, string> = {};
      data.forEach((gift) => {
        if (Array.isArray(gift.options) && gift.options.length > 0) {
          defaultOpts[gift.id] = String(gift.options[0]);
        } else {
          defaultOpts[gift.id] = "Standard Gift Assortment";
        }
      });
      setSelectedOptions(defaultOpts);
    } catch (err: any) {
      setError(err.message || "Failed to load gift hamper offerings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGifts();
  }, []);

  const handleToggleGift = (gift: AddOn) => {
    const existing = state.selectedAddOns.find((item) => item.addOnId === gift.id);
    if (existing) {
      removeAddOn(gift.id);
    } else {
      const optionName = selectedOptions[gift.id] || "Standard Option";
      addOrUpdateAddOn(gift.id, optionName, gift.price, gift.name, "GIFT", 1);
    }
  };

  const handleOptionChange = (gift: AddOn, optionName: string) => {
    setSelectedOptions((prev) => ({ ...prev, [gift.id]: optionName }));
    const existing = state.selectedAddOns.find((item) => item.addOnId === gift.id);
    if (existing) {
      addOrUpdateAddOn(gift.id, optionName, gift.price, gift.name, "GIFT", 1);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
            Step 7: Handcrafted Gift Hampers
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Surprise your loved ones with gourmet truffle boxes, personalized frames, or wine hampers.
          </p>
        </div>
        <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          (Optional Step)
        </span>
      </div>

      {loading ? (
        <Loader message="Loading luxury hampers from database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadGifts} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gifts.map((gift) => {
            const selectedItem = state.selectedAddOns.find((item) => item.addOnId === gift.id);
            const isSelected = !!selectedItem;
            const giftOptionsList = Array.isArray(gift.options) ? (gift.options as string[]) : [];

            return (
              <Card
                key={gift.id}
                className={`flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400"
                    : "hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Gift Hamper
                    </span>
                    <span className="text-lg font-black text-amber-400">₹{gift.price}</span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 mb-4">{gift.name}</h3>

                  {giftOptionsList.length > 0 && (
                    <div className="mb-4">
                      <Select
                        label="Select Edition / Pack"
                        value={selectedOptions[gift.id] || giftOptionsList[0]}
                        onChange={(e) => handleOptionChange(gift, e.target.value)}
                        options={giftOptionsList.map((opt) => ({ label: opt, value: opt }))}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleToggleGift(gift)}
                  >
                    {isSelected ? "Selected ✓ (Click to Remove)" : "Add Gift +₹" + gift.price}
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
          Proceed to Payment & Summary →
        </Button>
      </div>
    </div>
  );
};
