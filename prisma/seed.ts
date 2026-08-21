import { PrismaClient, Prisma, AddOnCategory, SlotStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Luxe Screens database seeding...");

  // Clean existing records in order of foreign key dependencies
  await prisma.cartItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.waitlist.deleteMany();

  console.log("🧹 Cleaned existing database tables.");

  // 1. Create Theaters
  const royalSuite = await prisma.theater.create({
    data: {
      name: "Royal Suite",
      basePrice: new Prisma.Decimal(2999.0),
      maxCapacity: 4,
      screen: "4K Laser Dolby Vision (135-inch)",
      sound: "Dolby Atmos 7.1.4 Studio Surround",
    },
  });

  const starlightLounge = await prisma.theater.create({
    data: {
      name: "Starlight Lounge",
      basePrice: new Prisma.Decimal(4999.0),
      maxCapacity: 8,
      screen: "180-inch 4K HDR MicroLED Wall",
      sound: "Bowers & Wilkins Surround 9.2",
    },
  });

  const grandVelvet = await prisma.theater.create({
    data: {
      name: "Grand Velvet Theater",
      basePrice: new Prisma.Decimal(7999.0),
      maxCapacity: 15,
      screen: "220-inch Dual Laser Cinema Screen",
      sound: "JBL Master Cinema Audio 11.4",
    },
  });

  const emperorPavilion = await prisma.theater.create({
    data: {
      name: "Emperor's Pavilion",
      basePrice: new Prisma.Decimal(11999.0),
      maxCapacity: 25,
      screen: "Immersive Curved IMAX-Standard Screen",
      sound: "Meyer Sound Ultra Cinema Audio System",
    },
  });

  console.log("✨ Seeded 4 premium theaters.");

  // 2. Create Slots for each theater
  const timeSlots = [
    "10:00 AM - 01:00 PM",
    "02:00 PM - 05:00 PM",
    "06:00 PM - 09:00 PM",
    "10:00 PM - 01:00 AM",
  ];

  const allTheaters = [royalSuite, starlightLounge, grandVelvet, emperorPavilion];

  for (const theater of allTheaters) {
    for (let i = 0; i < timeSlots.length; i++) {
      const slotTime = timeSlots[i];
      // Mark 1 slot blocked for maintenance testing
      const status = theater.id === royalSuite.id && i === 0 ? SlotStatus.BLOCKED : SlotStatus.AVAILABLE;
      await prisma.slot.create({
        data: {
          time: slotTime,
          status,
          theaterId: theater.id,
        },
      });
    }
  }

  console.log("🕒 Seeded time slots for all theaters.");

  // 3. Create Add-ons
  // CAKES
  await prisma.addOn.create({
    data: {
      name: "Belgian Dark Chocolate Truffle Cake",
      category: AddOnCategory.CAKE,
      price: new Prisma.Decimal(999.0),
      options: ["500g Classic Truffle", "1kg Deluxe Truffle"],
    },
  });

  await prisma.addOn.create({
    data: {
      name: "Red Velvet Cream Cheese Special",
      category: AddOnCategory.CAKE,
      price: new Prisma.Decimal(1299.0),
      options: ["500g Heart Shape", "1kg Multi-layer Classic"],
    },
  });

  await prisma.addOn.create({
    data: {
      name: "Fresh Seasonal Fruit & Gold Leaf Cake",
      category: AddOnCategory.CAKE,
      price: new Prisma.Decimal(1599.0),
      options: ["1kg Artisanal Fresh Cream"],
    },
  });

  // DECOR
  await prisma.addOn.create({
    data: {
      name: "Romantic Candlelight & Rose Petal Elegance",
      category: AddOnCategory.DECOR,
      price: new Prisma.Decimal(1999.0),
      options: ["Classic Rose Gold Theme", "Deep Crimson Passion Theme"],
    },
  });

  await prisma.addOn.create({
    data: {
      name: "Grand Birthday Celebration Arc & Neon LED",
      category: AddOnCategory.DECOR,
      price: new Prisma.Decimal(2499.0),
      options: ["Neon Birthday Glow Sign", "Pastel Balloon Arch"],
    },
  });

  await prisma.addOn.create({
    data: {
      name: "Ultra Luxe Proposal Canopy & Floral Setup",
      category: AddOnCategory.DECOR,
      price: new Prisma.Decimal(3999.0),
      options: ["Fairy Light Canopy with Fresh Rose Arch"],
    },
  });

  // GIFTS
  await prisma.addOn.create({
    data: {
      name: "Handcrafted Gourmet Chocolate Gift Box",
      category: AddOnCategory.GIFT,
      price: new Prisma.Decimal(799.0),
      options: ["9-piece Truffle Assortment", "16-piece Premium Box"],
    },
  });

  await prisma.addOn.create({
    data: {
      name: "Luxury Personalized Photo Hamper",
      category: AddOnCategory.GIFT,
      price: new Prisma.Decimal(1499.0),
      options: ["Custom Wooden Frame & Scented Candles"],
    },
  });

  await prisma.addOn.create({
    data: {
      name: "Executive Wine & Artisanal Cheese Hamper",
      category: AddOnCategory.GIFT,
      price: new Prisma.Decimal(2999.0),
      options: ["Imported Sparkling Beverage & Gourmet Cheese Assortment"],
    },
  });

  console.log("🎁 Seeded cake, decor, and gift add-ons.");

  console.log("✅ Luxe Screens seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
