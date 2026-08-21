# Luxe Screens — Bespoke Private Cinema & Luxury Hospitality

**Luxe Screens** is a luxury private cinema booking platform designed for high-end acoustic screening suites, milestone celebrations, date nights, and intimate private screenings in Indiranagar, Bengaluru.

The web application features an editorial, photography-first design aesthetic inspired by world-class boutique hospitality brands (Aman Resorts, Soho House, IMAX Private Cinema).

---

## 🎬 Key Features

- **Photography-First Editorial UI/UX**:
  - Immersive full-bleed photography with real project imagery.
  - Auto-rotating **Ken Burns crossfade hero carousel** with smooth opacity transitions.
  - High-contrast editorial serif typography (**Cormorant Garamond**) paired with monospace metadata accents.
  - Asymmetrical masonry portfolio gallery with responsive aspect ratios.

- **Private Cinema Suites Showcase (`/gallery`)**:
  - Full inventory of private suites (*Royal Suite*, *Starlight Lounge*, *Grand Velvet Theater*, *Emperor's Pavilion*).
  - Real-time search filtering by suite name, screen tech, or sound system.
  - Min capacity filtering & price sorting (Low to High, High to Low, Max Capacity).
  - Technical specification lightbox modal detailing display optics, audio architecture, and suite amenities.

- **Bespoke Booking Journey (`/booking`)**:
  - Guided step-by-step suite reservation system.
  - Dynamic slot selection (10:00 AM – 01:00 AM daily).
  - Culinary & decor add-on customizations (artisan cakes, romantic candlelit setups, neon LED arches, gourmet hampers).

- **AI Experience Planner (`/ai-planner`)**:
  - Recommendation engine matching guest count, occasion type, and styling preferences to optimal suite & add-on packages.

- **Locations & Expansion Waitlist (`/waitlist`)**:
  - Flagship Indiranagar lounge details and city expansion request portal.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) with Google Font `Cormorant Garamond`
- **Database & ORM**: [Prisma ORM 7](https://www.prisma.io/) with PostgreSQL (`@prisma/adapter-pg`)
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or v24.x installed
- **PostgreSQL**: Local PostgreSQL instance or a remote database connection (e.g. Prisma Postgres / Supabase / Neon)

### 1. Environment Setup

Create or update the `.env` file in the project root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/luxee_db"
```

### 2. Install Dependencies

```bash
cd luxe-screens
npm install
```

### 3. Database Migration & Seeding

Sync your database schema and populate initial private suites, slots, and add-on packages:

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed initial theaters, slots, and add-ons
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
luxe-screens/
├── prisma/
│   ├── schema.prisma       # Database models & enums
│   └── seed.ts             # Initial database seed script
├── public/                 # Static assets & real theatre photography
│   ├── hero_img.jpg
│   ├── service_grid img.jpg
│   └── theater_Preview.jpg
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Editorial Landing Page
│   │   ├── gallery/        # Theatres & Gallery Showcase
│   │   ├── booking/        # Suite Reservation Flow
│   │   ├── ai-planner/     # AI Recommendation Engine
│   │   ├── waitlist/       # Expansion Waitlist Portal
│   │   ├── api/            # REST API endpoints (Theaters, Slots, Addons, Bookings)
│   │   └── globals.css     # Global styles & Ken Burns animations
│   ├── components/         # Reusable UI & Layout components
│   │   ├── layout/         # Navbar & Footer
│   │   └── ui/             # Buttons, Cards, Modals, Inputs
│   ├── lib/                # API client & database utilities
│   └── types/              # TypeScript interface definitions
├── package.json
└── README.md
```

---

## 📜 NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Next.js development server at `localhost:3000` |
| `build` | `npm run build` | Compiles production build using Next.js Turbopack |
| `start` | `npm run start` | Runs production server |
| `lint` | `npm run lint` | Runs ESLint check |
| `seed` | `npx prisma db seed` | Populates database with luxury suites, slots & add-ons |

---

## 📍 Flagship Location

- **Luxe Screens Flagship Lounge**: 100 Feet Road, Indiranagar, Bengaluru, 560038
- **Hours**: 10:00 AM – 01:00 AM Daily
- **Valet**: Private complimentary valet at suite entrance
