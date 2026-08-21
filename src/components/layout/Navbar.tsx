"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Theatres & Gallery", href: "/gallery" },
    { name: "AI Planner", href: "/ai-planner" },
    { name: "Locations & Waitlist", href: "/waitlist" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-zinc-950 font-black text-xl tracking-tighter">LX</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-widest uppercase text-gold-gradient">
              LUXE SCREENS
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase -mt-1 font-mono">
              PRIVATE CINEMAS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-amber-400 tracking-wide ${isActive ? "text-amber-400 font-semibold" : "text-zinc-300"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/booking">
            <Button variant="primary" size="md">
              Book Experience
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 pt-3 pb-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium py-2 px-3 rounded-lg transition-colors ${pathname === link.href
                  ? "bg-amber-500/10 text-amber-400 font-semibold"
                  : "text-zinc-300 hover:bg-zinc-800"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full justify-center">
                Book Experience
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
