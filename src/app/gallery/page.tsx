"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTheaters } from "@/lib/api";
import { Theater } from "@/types/frontend";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function GalleryPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "capacity">("price-asc");

  // Lightbox Modal
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);

  const loadTheaters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTheaters();
      setTheaters(data);
    } catch (err: any) {
      setError(err.message || "Failed to load theater gallery from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheaters();
  }, []);

  // Filter & Sort Logic
  const filteredTheaters = theaters
    .filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.screen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.sound.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCapacity = t.maxCapacity >= minCapacity;

      return matchesSearch && matchesCapacity;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      if (sortBy === "capacity") return b.maxCapacity - a.maxCapacity;
      return 0;
    });

  return (
    <div className="flex flex-col w-full bg-zinc-950 text-zinc-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Cinema Showcase
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mt-2">
            The Luxe Gallery
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
            Explore our state-of-the-art private cinema suites. Filter by capacity, screen specs, or pricing to find your ideal suite.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search by suite name, screen, audio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="w-full sm:w-44">
              <Select
                label="Min Capacity"
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                options={[
                  { label: "All Capacities", value: 0 },
                  { label: "4+ Guests", value: 4 },
                  { label: "8+ Guests", value: 8 },
                  { label: "15+ Guests", value: 15 },
                  { label: "25+ Guests", value: 25 },
                ]}
              />
            </div>

            <div className="w-full sm:w-48">
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { label: "Price: Low to High", value: "price-asc" },
                  { label: "Price: High to Low", value: "price-desc" },
                  { label: "Max Capacity", value: "capacity" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <Loader message="Fetching luxury theater specifications from PostgreSQL..." />
        ) : error ? (
          <ErrorState title="Failed to Load Gallery" message={error} onRetry={loadTheaters} />
        ) : filteredTheaters.length === 0 ? (
          <EmptyState
            title="No Matching Suites Found"
            description="Try clearing your search query or selecting a lower capacity filter."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setMinCapacity(0);
              setSortBy("price-asc");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTheaters.map((theater) => (
              <Card
                key={theater.id}
                hoverEffect
                className="flex flex-col justify-between h-full group"
                onClick={() => setSelectedTheater(theater)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Up to {theater.maxCapacity} Guests
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">Suite #{theater.id}</span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100 group-hover:text-amber-400 transition-colors mb-3">
                    {theater.name}
                  </h3>

                  <div className="space-y-2.5 mb-6 text-xs text-zinc-400">
                    <p className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">🖥</span>
                      <span>{theater.screen}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">🔊</span>
                      <span>{theater.sound}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Base Price</span>
                    <span className="text-xl font-black text-amber-400">₹{theater.basePrice}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Inspect Specs
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Detail Modal */}
      <Modal
        isOpen={!!selectedTheater}
        onClose={() => setSelectedTheater(null)}
        title={selectedTheater?.name || "Theatre Details"}
        maxWidth="lg"
      >
        {selectedTheater && (
          <div className="space-y-6">
            <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Maximum Capacity</p>
                <p className="text-lg font-bold text-amber-400">{selectedTheater.maxCapacity} Guests</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider text-right">Base Slot Price</p>
                <p className="text-xl font-extrabold text-amber-400 text-right">₹{selectedTheater.basePrice}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Display Technology
                </h4>
                <p className="text-sm text-zinc-200 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  {selectedTheater.screen}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Audio Architecture
                </h4>
                <p className="text-sm text-zinc-200 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  {selectedTheater.sound}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Included Amenities
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <li>Private acoustic soundproofing</li>
                  <li>Leather motorized recliner seats</li>
                  <li>High-speed 1Gbps media stream connectivity</li>
                  <li>In-suite room service tablet ordering</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <Button variant="secondary" size="md" onClick={() => setSelectedTheater(null)}>
                Close
              </Button>
              <Link href={`/booking?theaterId=${selectedTheater.id}`}>
                <Button variant="primary" size="md">
                  Book This Suite
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
