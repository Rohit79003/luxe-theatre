import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function checkDatabaseData() {
  console.log("🔍 Checking PostgreSQL Database Seeded Data...\n");

  try {
    const theatersCount = await prisma.theater.count();
    const slotsCount = await prisma.slot.count();
    const addOnsCount = await prisma.addOn.count();
    const bookingsCount = await prisma.booking.count();
    const cartItemsCount = await prisma.cartItem.count();
    const waitlistCount = await prisma.waitlist.count();

    console.log("📊 Summary Row Counts:");
    console.log(`- Theaters: ${theatersCount}`);
    console.log(`- Slots: ${slotsCount}`);
    console.log(`- AddOns: ${addOnsCount}`);
    console.log(`- Bookings: ${bookingsCount}`);
    console.log(`- CartItems: ${cartItemsCount}`);
    console.log(`- Waitlist Entries: ${waitlistCount}\n`);

    if (theatersCount > 0) {
      const sampleTheaters = await prisma.theater.findMany({
        select: { id: true, name: true, basePrice: true, maxCapacity: true },
      });
      console.log("🎬 Seeded Theaters:");
      console.table(sampleTheaters.map(t => ({ id: t.id, name: t.name, price: Number(t.basePrice), capacity: t.maxCapacity })));
    }

    if (addOnsCount > 0) {
      const sampleAddOns = await prisma.addOn.findMany({
        select: { id: true, name: true, category: true, price: true },
      });
      console.log("\n🎁 Seeded Add-Ons (Sample):");
      console.table(sampleAddOns.map(a => ({ id: a.id, name: a.name, category: a.category, price: Number(a.price) })));
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error checking database:", error);
    await prisma.$disconnect();
  }
}

checkDatabaseData();
