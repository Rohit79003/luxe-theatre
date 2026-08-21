import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-zinc-950 font-black text-lg">
                LX
              </div>
              <span className="text-lg font-bold tracking-widest text-gold-gradient">
                LUXE SCREENS
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              India&apos;s premier private cinema destination. Delivering bespoke movie celebrations with 4K Dolby Vision, Studio Surround Audio, and artisanal gourmet dining.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Quick Navigation
            </h4>
            <Link href="/gallery" className="text-sm hover:text-amber-400 transition-colors">
              Theatres & Specs
            </Link>
            <Link href="/ai-planner" className="text-sm hover:text-amber-400 transition-colors">
              AI Experience Planner
            </Link>
            <Link href="/booking" className="text-sm hover:text-amber-400 transition-colors">
              Book a Slot
            </Link>
            <Link href="/waitlist" className="text-sm hover:text-amber-400 transition-colors">
              Upcoming Locations
            </Link>
          </div>

          {/* Offerings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Celebrations
            </h4>
            <span className="text-sm text-zinc-400">Birthday Extravaganzas</span>
            <span className="text-sm text-zinc-400">Romantic Anniversary Suites</span>
            <span className="text-sm text-zinc-400">Proposal Canopies</span>
            <span className="text-sm text-zinc-400">Private Gaming & Sports</span>
          </div>

          {/* Location & Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Flagship Lounge
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              100 Feet Road, Indiranagar<br />
              Bengaluru, Karnataka 560038
            </p>
            <p className="text-xs text-amber-400 font-mono mt-1">
              Open Daily: 09:30 AM - 01:30 AM
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Luxe Screens Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
