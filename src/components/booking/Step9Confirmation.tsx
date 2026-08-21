"use client";

import React from "react";
import Link from "next/link";
import { useBooking } from "@/context/booking-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const Step9Confirmation: React.FC = () => {
  const { state, calculateTotal, resetBooking } = useBooking();
  const receipt = state.confirmedReceipt || state.createdBooking;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-3xl mx-auto">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-emerald-500/20">
          ✓
        </div>
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          Booking Confirmed & Paid
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100">
          Reservation Receipt #{receipt?.id || "N/A"}
        </h2>
        <p className="text-sm text-zinc-400">
          Your private suite is reserved! A copy of this receipt has been dispatched to{" "}
          <span className="text-zinc-200 font-semibold">{receipt?.customer?.email || state.email}</span>.
        </p>
      </div>

      {/* Official Receipt Card */}
      <Card className="p-6 sm:p-10 border-amber-500/30 gold-border-glow space-y-8 bg-zinc-900/90 print:bg-white print:text-black print:p-0">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h3 className="text-2xl font-black text-gold-gradient tracking-widest uppercase">
              LUXE SCREENS
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              RECEIPT NO: {receipt?.receiptNumber || `LX-REC-${receipt?.id || 101}`}
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-extrabold rounded-md border border-emerald-500/30 uppercase tracking-wider">
              {receipt?.paymentStatus || "PAID"}
            </span>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">
              {receipt?.confirmedAt ? new Date(receipt.confirmedAt).toLocaleDateString() : new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Customer & Suite Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-300">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
              Primary Guest Details
            </h4>
            <p className="font-semibold text-sm text-zinc-100">{receipt?.customer?.name || state.name}</p>
            <p>📞 {receipt?.customer?.phone || state.phone}</p>
            <p>✉️ {receipt?.customer?.email || state.email}</p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">
              Screening Suite Specs
            </h4>
            <p className="font-semibold text-sm text-zinc-100">{receipt?.theater?.name || state.theater?.name}</p>
            <p>📅 Date: {receipt?.date || state.date}</p>
            <p>🕒 Slot: {receipt?.slot?.time || state.slotTime}</p>
            <p>👥 Guests: {receipt?.guests || state.guests} ({receipt?.occasion || state.occasion})</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Purchased Line Items
          </h4>
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-zinc-100">{receipt?.theater?.name || state.theater?.name} (Suite Booking)</td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-right font-mono">₹{receipt?.theater?.basePrice || state.theater?.basePrice}</td>
                </tr>
                {(receipt?.cartItems || state.selectedAddOns).map((item: any) => (
                  <tr key={item.id || item.addOnId}>
                    <td className="p-3">
                      {item.addOnName || item.name} <span className="text-zinc-500 font-mono">({item.optionName})</span>
                    </td>
                    <td className="p-3 text-center font-mono">{item.quantity || 1}</td>
                    <td className="p-3 text-right font-mono">₹{(item.price || 0) * (item.quantity || 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Summary Bar */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-300">Total Amount Paid</span>
          <span className="text-2xl font-black text-amber-400">₹{receipt?.total || calculateTotal()}</span>
        </div>

        <div className="text-center text-xs text-zinc-500 pt-2 font-mono">
          Flagship Suite: 100 Feet Road, Indiranagar, Bengaluru. Please show this digital receipt upon arrival.
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Button variant="secondary" size="md" onClick={handlePrint}>
          🖨 Print / Download Receipt
        </Button>
        <Link href="/" onClick={resetBooking}>
          <Button variant="primary" size="md">
            Return to Home & Start New Booking
          </Button>
        </Link>
      </div>
    </div>
  );
};
