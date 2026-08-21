"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPlannerRecommendation } from "@/lib/api";
import { PlannerRecommendation, RecommendedAddOn } from "@/types/frontend";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";

export default function AiPlannerPage() {
  const router = useRouter();

  // Form Inputs
  const [occasion, setOccasion] = useState("BIRTHDAY");
  const [guests, setGuests] = useState<number>(4);
  const [budget, setBudget] = useState<number>(8000);

  // Recommendation State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<PlannerRecommendation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGenerateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setHasSearched(true);

    try {
      const result = await requestPlannerRecommendation(occasion, Number(guests), Number(budget));
      setRecommendation(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate recommendation for your budget & guests criteria.");
      setRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBookExperience = () => {
    if (!recommendation) return;
    // Build query string with recommended selections to pre-populate booking context
    const params = new URLSearchParams({
      theaterId: recommendation.theater.id.toString(),
      guests: guests.toString(),
      occasion: occasion,
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full bg-zinc-950 text-zinc-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
            ✨ Intelligent Package Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100">
            AI Experience Planner
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
            Enter your occasion, guest count, and budget limit. Our scoring engine queries PostgreSQL database to formulate the optimal theatre + add-on package.
          </p>
        </div>

        {/* Input Form Card */}
        <Card className="p-6 sm:p-8 mb-12 border-amber-500/20 shadow-2xl">
          <form onSubmit={handleGenerateRecommendation} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Select
              label="Select Occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              options={[
                { label: "Birthday Celebration", value: "BIRTHDAY" },
                { label: "Romantic Anniversary", value: "ANNIVERSARY" },
                { label: "Marriage Proposal", value: "PROPOSAL" },
                { label: "Cozy Date Night", value: "DATE_NIGHT" },
                { label: "Movie Marathon", value: "MOVIE_MARATHON" },
                { label: "Family Get-Together", value: "FAMILY_GETTOGETHER" },
              ]}
            />

            <Input
              label="Guest Count"
              type="number"
              min={1}
              max={30}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              placeholder="e.g. 4"
            />

            <Input
              label="Budget Limit (INR ₹)"
              type="number"
              min={1000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="e.g. 8000"
            />

            <div className="md:col-span-3 pt-2">
              <Button variant="primary" size="lg" className="w-full justify-center" isLoading={loading}>
                Generate Recommended Package ✨
              </Button>
            </div>
          </form>
        </Card>

        {/* Results Area */}
        {loading && (
          <Loader message="Querying live PostgreSQL database to match optimal theater and add-ons..." />
        )}

        {error && (
          <ErrorState
            title="Recommendation Criteria Error"
            message={error}
            onRetry={() => handleGenerateRecommendation({ preventDefault: () => {} } as any)}
          />
        )}

        {!loading && hasSearched && !error && !recommendation && (
          <Card className="text-center p-12">
            <h3 className="text-xl font-bold text-amber-400 mb-2">No Matching Package Found</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
              Your budget of ₹{budget} is lower than the cheapest available suite capable of holding {guests} guests.
            </p>
            <Button variant="outline" onClick={() => setBudget(budget + 2000)}>
              Increase Budget to ₹{budget + 2000} & Retry
            </Button>
          </Card>
        )}

        {!loading && recommendation && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            {/* Top Match Card */}
            <Card className="p-6 sm:p-10 border-amber-500/40 gold-border-glow relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/40">
                      ★ Score: {recommendation.score}/100 Match
                    </span>
                    <span className="text-xs text-zinc-400 uppercase tracking-widest">
                      Optimal Recommendation
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-zinc-100">
                    {recommendation.theater.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    {recommendation.theater.screen} • {recommendation.theater.sound}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Recommended Package Total</span>
                  <span className="text-3xl font-black text-amber-400">₹{recommendation.total}</span>
                  <span className="text-xs text-emerald-400 block font-mono mt-1">
                    Remaining Budget: ₹{recommendation.remainingBudget}
                  </span>
                </div>
              </div>

              {/* Recommendation Reason */}
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 mb-8 text-sm text-zinc-300 leading-relaxed">
                💡 <span className="font-semibold text-amber-300">Why this package: </span>
                {recommendation.recommendationReason}
              </div>

              {/* Package Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Suite Cost */}
                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                    1. Private Cinema Suite
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-200">{recommendation.theater.name} Base Rate</span>
                    <span className="font-bold text-zinc-100">₹{recommendation.theater.basePrice}</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Accommodates up to {recommendation.theater.maxCapacity} guests in complete privacy.
                  </p>
                </div>

                {/* Selected Add-Ons */}
                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                    2. Recommended Occasion Add-Ons ({recommendation.selectedAddOns.length})
                  </h4>
                  {recommendation.selectedAddOns.length === 0 ? (
                    <p className="text-xs text-zinc-500">No add-ons selected within this budget.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {recommendation.selectedAddOns.map((addon: RecommendedAddOn) => (
                        <div key={addon.id} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-zinc-200">{addon.name}</span>
                            <span className="text-zinc-500 block">({addon.optionName})</span>
                          </div>
                          <span className="font-bold text-amber-300">₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-400">
                  Ready to reserve this AI-curated experience? Proceed to select your booking slot.
                </p>
                <Button variant="primary" size="lg" onClick={handleBookExperience} className="w-full sm:w-auto">
                  Book This Experience Now →
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
