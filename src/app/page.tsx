"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { fetchTheaters } from "@/lib/api";
import { Theater } from "@/types/frontend";

export default function HomePage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);
  const [theaterError, setTheaterError] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroSlide, setHeroSlide] = useState(0);

  // Hero carousel slides (All 100% unique photos, prioritizing New folder hero_img.jpg)
  const heroSlides = [
    {
      url: "/hero_img.jpg", // From New folder!
      title: "Bespoke Private Cinema",
      subtitle: "Commercial 4K Laser Projection • Studio Surround Acoustics • Intimate Recliner Lounges",
    },
    {
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop",
      title: "Ultra-Private Screenings",
      subtitle: "Tailored for Anniversaries, Date Nights, Proposals, and Milestone Celebrations",
    },
    {
      url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2000&auto=format&fit=crop",
      title: "Studio Surround Acoustics",
      subtitle: "Dolby Atmos 7.1.4 Audio Architecture with 100% Acoustic Sound Isolation",
    },
    {
      url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=2000&auto=format&fit=crop",
      title: "Gourmet Concierge Dining",
      subtitle: "Artisan Desserts, Fine Champagne & Handcrafted Small Plates Delivered In-Suite",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const loadTheaters = async () => {
    try {
      setLoadingTheaters(true);
      setTheaterError(null);
      const data = await fetchTheaters();
      setTheaters(data);
    } catch (err: any) {
      setTheaterError(err.message || "Failed to load theaters from server");
    } finally {
      setLoadingTheaters(false);
    }
  };

  useEffect(() => {
    loadTheaters();
  }, []);

  const faqs = [
    {
      q: "What content can we stream in our private suite?",
      a: "You can stream any platform including Netflix, Prime Video, Disney+, Hotstar, YouTube, or connect your own laptop/console via high-speed 4K HDMI. Each suite features dedicated 1Gbps fiber connectivity.",
    },
    {
      q: "Can we request bespoke celebration decor?",
      a: "Yes. We specialize in intimate celebrations. Select custom balloon arches, neon LED lettering, floral canopies, candlelit pathways, and personalized celebration cakes during your booking.",
    },
    {
      q: "What are the suite guest capacities?",
      a: "Our suites range from intimate 4–6 guest suites ('The Royal Suite') to expansive 25-guest private screening lounges ('Emperor's Pavilion'). Each suite is strictly private for your booked group.",
    },
    {
      q: "Is food and beverage service available inside the suite?",
      a: "We offer an executive culinary menu featuring artisan chocolates, freshly baked celebration cakes, sparkling beverages, and warm cinema savories ordered directly via your in-suite tablet.",
    },
    {
      q: "What is your rescheduling and cancellation policy?",
      a: "Bookings can be rescheduled with zero fee up to 24 hours prior to your reservation time.",
    },
  ];

  // Gallery preview items (Asymmetrical Masonry layout with 100% unique photos)
  const galleryItems = [
    {
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
      title: "The Emperor Screen",
      category: "4K LASER SUITE",
      colSpan: "md:col-span-2 md:row-span-2",
      aspect: "aspect-[16/10]",
    },
    {
      url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
      title: "Private Lounge Service",
      category: "GASTRONOMY",
      colSpan: "md:col-span-1",
      aspect: "aspect-[4/5]",
    },
    {
      url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1000&auto=format&fit=crop",
      title: "Leather Recliner Seating",
      category: "ACOUSTIC SUITE",
      colSpan: "md:col-span-1",
      aspect: "aspect-square",
    },
    {
      url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop",
      title: "Candlelit Atmosphere",
      category: "ROMANTIC DECOR",
      colSpan: "md:col-span-1 md:row-span-2",
      aspect: "aspect-[3/4]",
    },
    {
      url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
      title: "Studio Acoustics",
      category: "DOLBY VISION",
      colSpan: "md:col-span-2",
      aspect: "aspect-[16/9]",
    },
    {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      title: "Artisan Patisserie",
      category: "CELEBRATIONS",
      colSpan: "md:col-span-1",
      aspect: "aspect-square",
    },
    {
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop",
      title: "Vip Foyer Lounge",
      category: "INDIRANAGAR",
      colSpan: "md:col-span-2",
      aspect: "aspect-[21/9]",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      {/* 1. HERO SECTION (Photography-First, Ken Burns Zoom, Crossfade) */}
      <section className="relative w-full h-screen min-h-[700px] max-h-[1050px] overflow-hidden flex items-center justify-center">
        {/* Background Images Crossfade with Ken Burns Zoom */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === heroSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover animate-kenburns filter brightness-[0.75]"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          </div>
        ))}

        {/* Hero Editorial Text Overlay */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-16 flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-400/90 mb-6 border-b border-amber-400/30 pb-1">
            Indiranagar Flagship Lounge • Bengaluru
          </span>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal tracking-tight leading-[1.05] mb-6 text-zinc-100">
            Bespoke Cinema <br />
            <span className="italic font-light text-amber-300">
              & Private Celebrations
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-zinc-300/90 font-sans tracking-wide leading-relaxed mb-10">
            {heroSlides[heroSlide].subtitle}
          </p>

          {/* Minimal Editorial CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              href="/booking"
              className="px-8 py-3.5 rounded border border-amber-500/80 bg-amber-500 text-zinc-950 text-xs font-mono tracking-[0.2em] uppercase font-semibold hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-amber-500/10"
            >
              Reserve Private Suite
            </Link>
            <a
              href="#suites"
              className="px-8 py-3.5 rounded border border-zinc-700/80 bg-black/40 backdrop-blur-sm text-zinc-300 text-xs font-mono tracking-[0.2em] uppercase hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300"
            >
              Explore Suites
            </a>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-3 mt-16">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 transition-all duration-500 rounded-full cursor-pointer ${
                  idx === heroSlide ? "w-10 bg-amber-400" : "w-3 bg-zinc-600/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Minimal Hero Stats Bar at Bottom Edge */}
        <div className="absolute bottom-0 inset-x-0 z-20 border-t border-zinc-800/40 bg-zinc-950/60 backdrop-blur-md hidden md:block">
          <div className="max-w-7xl mx-auto px-8 py-4 grid grid-cols-4 divide-x divide-zinc-800/50 text-center">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-amber-400 uppercase">4.9 ★ GUEST RATING</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Verified Hospitality Reviews</p>
            </div>
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-zinc-200 uppercase">100% PRIVATE</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Acoustic Soundproof Suites</p>
            </div>
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-amber-400 uppercase">4K LASER CINEMA</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Dolby Vision Commercial Grade</p>
            </div>
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-zinc-200 uppercase">DOLBY ATMOS 7.1.4</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Studio Architectural Surround</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES EDITORIAL SHOWCASE (Asymmetrical Split, Large Photography) */}
      <section className="py-28 md:py-36 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Main Focal Visual (Using service_grid img.jpg from New folder!) */}
          <div className="lg:col-span-7 relative group overflow-hidden border border-zinc-800/80 rounded-sm">
            <img
              src="/service_grid img.jpg"
              alt="Luxe Screens Suite Experience"
              className="w-full h-[450px] sm:h-[580px] object-cover filter brightness-[0.9] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase block mb-1">
                EXECUTIVE CINEMA LOUNGE
              </span>
              <h4 className="text-xl font-serif text-zinc-100">
                Crafted for Intimate High-Fidelity Viewing
              </h4>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 mb-3">
              Unrivaled Suite Standards
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-zinc-100 leading-tight mb-8">
              Engineered For <br />
              <span className="italic text-amber-300 font-light">Unforgettable</span> Moments
            </h2>

            <div className="space-y-8 border-t border-zinc-900 pt-8">
              <div className="group">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 block mb-1">01 / ACOUSTICS</span>
                <h3 className="text-lg font-serif text-zinc-200 group-hover:text-amber-300 transition-colors">
                  4K Laser Projection & Dolby Atmos
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
                  Ultra-short-throw 4K Laser Optics paired with calibrated 7.1.4 architectural surround sound for studio acoustics in full acoustic isolation.
                </p>
              </div>

              <div className="border-t border-zinc-900 pt-8 group">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 block mb-1">02 / CELEBRATIONS</span>
                <h3 className="text-lg font-serif text-zinc-200 group-hover:text-amber-300 transition-colors">
                  Bespoke Decor & Proposal Canopies
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
                  Neon LED backdrop arches, rose petal arrangements, gourmet celebration cakes, and surprise hampers customized prior to your arrival.
                </p>
              </div>

              <div className="border-t border-zinc-900 pt-8 group">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 block mb-1">03 / HOSPITALITY</span>
                <h3 className="text-lg font-serif text-zinc-200 group-hover:text-amber-300 transition-colors">
                  Executive Recliners & Tablet Service
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
                  Custom Italian leather recliners with seamless room service ordering via tablet so your movie screening remains completely uninterrupted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISUAL SECTION 1: CINEMATIC THEATRE EXPERIENCE (Edge-to-Edge Image Feature) */}
      <section className="relative w-full py-32 md:py-44 px-6 overflow-hidden flex items-center justify-center border-b border-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2000&auto=format&fit=crop"
          alt="Cinematic Acoustic Theatre"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-zinc-950/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400/90 block mb-4">
            ACOUSTIC ISOLATION ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-zinc-100 leading-tight mb-8">
            &ldquo;Every decibel calibrated for private emotional resonance.&rdquo;
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-sans mb-10">
            Step into 100% soundproofed private screening chambers engineered with floating wall construction, high-density acoustic diffusers, and zero exterior disturbance.
          </p>
          <div className="inline-flex items-center gap-6 border-y border-zinc-800/80 py-4 px-8">
            <span className="text-xs font-mono tracking-[0.2em] text-zinc-300 uppercase">100% SOUNDPROOF</span>
            <span className="text-zinc-700">•</span>
            <span className="text-xs font-mono tracking-[0.2em] text-amber-400 uppercase">ZERO LATENCY HDMI 2.1</span>
            <span className="text-zinc-700">•</span>
            <span className="text-xs font-mono tracking-[0.2em] text-zinc-300 uppercase">1Gbps FIBER</span>
          </div>
        </div>
      </section>

      {/* 4. THEATRE SHOWCASE SECTION (Alternating Image -> Info Layout) */}
      <section id="suites" className="py-28 md:py-36 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-zinc-900 pb-8">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 block mb-2">
              EXCLUSIVE SUITES
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif text-zinc-100">
              Private Cinema Collections
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-mono tracking-[0.2em] uppercase text-amber-400 hover:text-amber-300 border-b border-amber-400/40 pb-1 w-fit"
          >
            View All Suite Specifications →
          </Link>
        </div>

        {loadingTheaters ? (
          <Loader message="Fetching private suite inventory..." />
        ) : theaterError ? (
          <ErrorState title="Suite Inventory Error" message={theaterError} onRetry={loadTheaters} />
        ) : (
          <div className="space-y-24 md:space-y-32">
            {theaters.map((theater, idx) => {
              const isEven = idx % 2 === 0;
              // Unique images for suites, prioritizing theater_Preview.jpg from New folder for first suite
              const suiteImages = [
                "/theater_Preview.jpg", // From New folder!
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1200&auto=format&fit=crop",
              ];
              const imageSrc = suiteImages[idx % suiteImages.length];

              return (
                <div
                  key={theater.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Suite Image (Alternating position) */}
                  <div
                    className={`lg:col-span-7 relative group overflow-hidden border border-zinc-800/80 rounded-sm ${
                      !isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <img
                      src={imageSrc}
                      alt={theater.name}
                      className="w-full h-[380px] sm:h-[480px] object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 border border-zinc-800 text-xs font-mono tracking-widest text-amber-400 uppercase">
                      SUITE #{theater.id}
                    </div>
                  </div>

                  {/* Suite Info (Alternating position) */}
                  <div
                    className={`lg:col-span-5 flex flex-col justify-center ${
                      !isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-zinc-400 mb-2">
                      CAPACITY: UP TO {theater.maxCapacity} GUESTS
                    </span>

                    <h3 className="text-3xl sm:text-4xl font-serif text-zinc-100 mb-4">
                      {theater.name}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-8">
                      An intimate screening suite featuring bespoke plush recliners, custom ambient lighting, and high-fidelity studio surround audio. Designed for milestone anniversaries, private birthdays, and date nights.
                    </p>

                    {/* Clean Specs Bar (No Icons) */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-900 mb-8">
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">
                          SCREEN TYPE
                        </span>
                        <span className="text-xs font-mono text-zinc-300 mt-1 block">
                          {theater.screen}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">
                          AUDIO ARCHITECTURE
                        </span>
                        <span className="text-xs font-mono text-zinc-300 mt-1 block">
                          {theater.sound}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase block">
                          RESERVATION FROM
                        </span>
                        <span className="text-xl font-serif text-amber-400 font-semibold">
                          ₹{theater.basePrice}
                        </span>
                      </div>

                      <Link
                        href={`/booking?theaterId=${theater.id}`}
                        className="px-6 py-2.5 rounded border border-amber-500/60 bg-amber-500/10 text-amber-300 text-xs font-mono tracking-[0.18em] uppercase hover:bg-amber-500 hover:text-zinc-950 transition-all duration-300"
                      >
                        Reserve Suite
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. VISUAL SECTION 2: CELEBRATION & ROMANTIC EXPERIENCES */}
      <section id="experiences" className="py-28 md:py-36 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 mb-3">
              BESPOKE CELEBRATIONS
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-zinc-100 leading-tight mb-6">
              Tailored For <br />
              <span className="italic text-amber-300 font-light">Romantic & Milestone</span> Events
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-8">
              Whether preparing a surprise marriage proposal under floral arches or celebrating an intimate birthday with customized neon signage, our dedicated event concierge arranges every visual element before your arrival.
            </p>

            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono text-amber-400">01</span>
                <div>
                  <h4 className="text-xs font-mono tracking-wider uppercase text-zinc-200">Custom Neon & Floral Decor</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">Personalized illuminated lettering and fresh botanical backdrops.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-t border-zinc-900/60 pt-4">
                <span className="text-xs font-mono text-amber-400">02</span>
                <div>
                  <h4 className="text-xs font-mono tracking-wider uppercase text-zinc-200">Candlelit Aisleways & Petals</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">Intimate glowing ambience crafted specifically for date nights.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-t border-zinc-900/60 pt-4">
                <span className="text-xs font-mono text-amber-400">03</span>
                <div>
                  <h4 className="text-xs font-mono tracking-wider uppercase text-zinc-200">Handcrafted Celebration Cakes</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">Artisan dark chocolate truffle and gourmet red velvet options.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative group overflow-hidden border border-zinc-800/80 rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
              alt="Romantic Private Celebration"
              className="w-full h-[450px] sm:h-[550px] object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase block mb-1">
                PRIVATE SUITE STAGING
              </span>
              <h4 className="text-xl font-serif text-zinc-100">
                Surprise Proposal & Anniversary Setups
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW (Asymmetrical Masonry Layout, 7 Unique Photos) */}
      <section id="gallery" className="py-28 md:py-36 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 block mb-2">
              PORTFOLIO
            </span>
            <h2 className="text-4xl sm:text-6xl font-serif text-zinc-100">
              Visual Impressions
            </h2>
          </div>
          <p className="text-xs font-mono tracking-widest text-zinc-400 uppercase max-w-xs">
            A glimpse inside our bespoke Bengaluru screening suites and curated lounge experiences.
          </p>
        </div>

        {/* Asymmetrical Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`relative group overflow-hidden border border-zinc-800/80 rounded-sm bg-zinc-900 ${item.colSpan}`}
            >
              <div className={`w-full h-full min-h-[300px] ${item.aspect}`}>
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase block mb-1">
                  {item.category}
                </span>
                <h4 className="text-lg font-serif text-zinc-100">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. VISUAL SECTION 3: HOSPITALITY & GOURMET ADD-ONS (Edge-to-Edge Feature) */}
      <section className="relative w-full py-32 md:py-44 px-6 overflow-hidden flex items-center justify-center border-t border-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000&auto=format&fit=crop"
          alt="Executive Hospitality"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400/90 block mb-4">
            IN-SUITE GASTRONOMY
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif text-zinc-100 leading-tight mb-6">
            Fine Dining & Artisan Concierge
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-10">
            Enjoy hand-selected executive savory platters, sparkling drinks, artisanal chocolates, and warm buttered cinema treats delivered directly to your suite recliner.
          </p>
          <Link
            href="/booking"
            className="px-8 py-3.5 rounded border border-amber-500/60 bg-amber-500/10 text-amber-300 text-xs font-mono tracking-[0.2em] uppercase hover:bg-amber-500 hover:text-zinc-950 transition-all duration-300 inline-block"
          >
            Explore Culinary Offerings
          </Link>
        </div>
      </section>

      {/* 8. AI PLANNER TEASER (Refined Dark Luxury Box) */}
      <section className="py-24 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="relative rounded-sm bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 p-10 sm:p-16 overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase block mb-3">
              SMART RECOMMENDATION ENGINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-zinc-100 mb-4 leading-tight">
              Unsure which suite fits your occasion? <br />
              <span className="italic text-amber-300 font-light">Let AI Plan Your Screening.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed mb-8">
              Select your guest count, occasion type, and preferred styling. Our recommendation engine instantly matches capacity, decor packages, and culinary pairings.
            </p>
            <Link
              href="/ai-planner"
              className="px-7 py-3 rounded border border-amber-500/80 bg-amber-500 text-zinc-950 text-xs font-mono tracking-[0.2em] uppercase font-semibold hover:bg-amber-400 transition-all duration-300 inline-block"
            >
              Launch AI Experience Planner →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION (Minimal Accordion Lines) */}
      <section className="py-28 md:py-36 px-6 sm:px-12 lg:px-16 max-w-4xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 block mb-2">
            CONCIERGE DIRECTORY
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-zinc-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2 border-t border-zinc-900">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="border-b border-zinc-900 py-4 transition-colors">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full py-3 flex items-center justify-between text-left font-serif text-base sm:text-lg text-zinc-200 hover:text-amber-300 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-amber-400 text-sm font-mono ml-4">
                    {isOpen ? "—" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-4 pt-1 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. LOCATION & CONTACT SECTION (Editorial Minimalist) */}
      <section className="py-28 md:py-36 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400/90 block mb-2">
              FLAGSHIP LOUNGE
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif text-zinc-100 mb-6">
              Indiranagar Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-8 max-w-md">
              Located in central Bengaluru, our flagship lounge features soundproof private suites, dedicated private valet parking, and executive culinary kitchen services.
            </p>
            <div className="space-y-3 text-xs font-mono text-zinc-300 border-t border-zinc-900 pt-6">
              <p>📍 100 Feet Road, Indiranagar, Bengaluru, 560038</p>
              <p>📞 Concierge Direct: +91-98765-43210</p>
              <p>⏰ Screening Hours: 10:00 AM – 01:00 AM Daily</p>
            </div>
          </div>

          <div className="lg:col-span-6 border border-zinc-800/80 p-8 sm:p-12 bg-zinc-950 flex flex-col justify-center items-center text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase mb-2">
              VALET & CONCIERGE ACCESS
            </span>
            <h3 className="text-2xl font-serif text-zinc-100 mb-4">
              Private Reserved Valet
            </h3>
            <p className="text-xs text-zinc-400 font-sans max-w-xs mb-8 leading-relaxed">
              Complimentary valet service provided at our Indiranagar private entrance for all reserved suite guests.
            </p>
            <Link
              href="/booking"
              className="px-6 py-3 rounded border border-amber-500/60 bg-amber-500/10 text-amber-300 text-xs font-mono tracking-[0.2em] uppercase hover:bg-amber-500 hover:text-zinc-950 transition-all duration-300"
            >
              Book Private Experience Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
