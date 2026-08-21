"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitWaitlist } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ErrorState } from "@/components/ui/ErrorState";

export default function WaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("Koramangala, Bangalore");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedEntryId, setSubmittedEntryId] = useState<number | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Valid email address is required";
    }
    if (!phone.trim() || phone.trim().length < 10) {
      errors.phone = "Valid phone number is required (min 10 digits)";
    }
    if (!preferredLocation.trim()) {
      errors.preferredLocation = "Preferred location is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await submitWaitlist({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        preferredLocation: preferredLocation.trim(),
        notes: notes.trim() || undefined,
      });

      setSubmittedEntryId(result.id);
      setSuccessModalOpen(true);

      // Reset Form
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Failed to submit waitlist request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-zinc-950 text-zinc-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Expansion Priority Access
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mt-2">
            Bring Luxe Screens To Your City
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
            We are expanding our luxury private cinema lounges. Register your interest to get VIP early access and exclusive opening night suite discounts.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-10 border-zinc-800 shadow-2xl">
          {error && <ErrorState message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                placeholder="e.g. Sophia Taylor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. sophia@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number *"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={fieldErrors.phone}
              />

              <Select
                label="Preferred Location *"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                options={[
                  { label: "Koramangala, Bangalore", value: "Koramangala, Bangalore" },
                  { label: "Whitefield, Bangalore", value: "Whitefield, Bangalore" },
                  { label: "HSR Layout, Bangalore", value: "HSR Layout, Bangalore" },
                  { label: "Jubilee Hills, Hyderabad", value: "Jubilee Hills, Hyderabad" },
                  { label: "Bandra West, Mumbai", value: "Bandra West, Mumbai" },
                  { label: "Gurugram, Delhi-NCR", value: "Gurugram, Delhi-NCR" },
                ]}
                error={fieldErrors.preferredLocation}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Special Requests or Experience Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Tell us if you are looking for specific seating sizes, rooftop suites, or corporate bookings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-900/90 text-zinc-100 placeholder-zinc-500 text-sm rounded-lg border border-zinc-800 p-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/80 transition-all"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full justify-center"
              isLoading={loading}
            >
              Join VIP Expansion Waitlist
            </Button>
          </form>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="You're On The VIP Waitlist!"
        maxWidth="md"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto border border-amber-500/40 shadow-xl shadow-amber-500/10">
            ✨
          </div>
          <h4 className="text-xl font-bold text-zinc-100">
            Waitlist Entry #{submittedEntryId} Confirmed
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Thank you for registering your interest for <span className="text-amber-400 font-semibold">{preferredLocation}</span>. We will notify you first when private suite reservations launch in your area.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/booking">
              <Button variant="primary" size="md">
                Book Existing Indiranagar Suite
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
