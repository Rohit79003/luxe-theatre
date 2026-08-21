import "dotenv/config";
import { getAllTheaters, getTheaterById } from "../src/lib/services/theater.service";
import { getAddOns } from "../src/lib/services/addon.service";
import { getSlotsAvailability } from "../src/lib/services/slot.service";
import { generatePlannerRecommendation } from "../src/lib/planner/recommendation";
import { validateCoupon } from "../src/lib/services/coupon.service";
import { createBooking, getBookingById } from "../src/lib/services/booking.service";
import { processPayment } from "../src/lib/services/payment.service";
import { addWaitlistEntry } from "../src/lib/services/waitlist.service";

async function runApiVerification() {
  console.log("🚀 Starting Luxe Screens API Verification Suite...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (detail) console.error(`   └─ ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Theater API
    const theaters = await getAllTheaters();
    assert(theaters.length >= 4, "GET /api/theaters returns seeded theaters", `Count: ${theaters.length}`);

    const singleTheater = await getTheaterById(theaters[0].id);
    assert(singleTheater !== null && singleTheater.name === theaters[0].name, "GET /api/theaters/:id returns theater details", `Name: ${singleTheater?.name}`);

    // 2. AddOn API
    const allAddOns = await getAddOns();
    assert(allAddOns.length >= 9, "GET /api/addons returns all add-ons", `Count: ${allAddOns.length}`);

    const cakeAddOns = await getAddOns("CAKE");
    assert(cakeAddOns.length >= 3 && cakeAddOns.every(a => a.category === "CAKE"), "GET /api/addons?category=CAKE filters correctly");

    // 3. Slot API
    const testDate = "2026-09-01";
    const slots = await getSlotsAvailability(testDate, theaters[0].id);
    assert(slots.length === 4, "GET /api/slots returns slots for theater", `Slots found: ${slots.length}`);

    // 4. AI Planner API
    const plannerRec = await generatePlannerRecommendation({
      occasion: "BIRTHDAY",
      guests: 6,
      budget: 9000,
    });
    assert(plannerRec !== null && plannerRec.total <= 9000, "POST /api/planner returns valid package recommendation", `Theater: ${plannerRec?.theater.name}, Total: ₹${plannerRec?.total}`);

    const lowBudgetRec = await generatePlannerRecommendation({
      occasion: "BIRTHDAY",
      guests: 6,
      budget: 500,
    });
    assert(lowBudgetRec === null, "POST /api/planner returns null when budget is too low");

    // 5. Coupon API
    const validCoupon = validateCoupon("LUXE500", 7000);
    assert(validCoupon.valid && validCoupon.discount === 500 && validCoupon.finalTotal === 6500, "POST /api/coupons/validate handles LUXE500");

    const invalidCoupon = validateCoupon("INVALIDCODE", 7000);
    assert(!invalidCoupon.valid && invalidCoupon.discount === 0, "POST /api/coupons/validate rejects invalid coupon");

    // 6. Booking Creation API
    const availableSlot = slots.find(s => s.isAvailable);
    assert(!!availableSlot, "Found available slot for booking creation test");

    const bookingInput = {
      theaterId: theaters[0].id,
      slotId: availableSlot!.id,
      date: testDate,
      guests: 2,
      name: "Alexander Wright",
      phone: "+91-9876543210",
      email: "alexander@luxescreens.com",
      occasion: "ANNIVERSARY",
      location: "Indiranagar, Bangalore",
      addOns: [
        {
          addOnId: allAddOns[0].id,
          optionName: "500g Classic Truffle",
          quantity: 1,
        },
      ],
      couponCode: "LUXE500",
    };

    const newBooking = await createBooking(bookingInput);
    assert(newBooking.paymentStatus === "PENDING" && newBooking.id > 0, "POST /api/bookings creates booking with PENDING status", `Booking ID: #${newBooking.id}, Server Total: ₹${newBooking.total}`);

    // 7. Capacity Violation Error Test
    try {
      await createBooking({
        ...bookingInput,
        guests: 999, // Exceeds capacity
      });
      assert(false, "POST /api/bookings capacity violation check");
    } catch (err: any) {
      assert(err.message.includes("exceeds theater maximum capacity"), "POST /api/bookings rejects guest count exceeding capacity", err.message);
    }

    // 8. Double Booking Prevention Error Test
    try {
      await createBooking({
        ...bookingInput,
        name: "Second Person",
        email: "second@test.com",
      });
      assert(false, "POST /api/bookings double booking prevention check");
    } catch (err: any) {
      assert(err.message.includes("already booked"), "POST /api/bookings prevents double booking of same slot/date", err.message);
    }

    // 9. Payment Simulation API
    const paymentRes = await processPayment(newBooking.id);
    assert(paymentRes.paymentStatus === "PAID", "POST /api/payments processes payment to PAID status", `Transaction ID: ${paymentRes.transactionId}`);

    // 10. Already Paid Error Test
    try {
      await processPayment(newBooking.id);
      assert(false, "POST /api/payments already paid check");
    } catch (err: any) {
      assert(err.message.includes("already been paid"), "POST /api/payments rejects duplicate payment on paid booking", err.message);
    }

    // 11. Booking Confirmation Details API
    const confirmedBooking = await getBookingById(newBooking.id);
    assert(confirmedBooking !== null && confirmedBooking.paymentStatus === "PAID", "POST /api/booking/confirm returns confirmed receipt details");

    // 12. Waitlist Lead Capture API
    const waitlistEntry = await addWaitlistEntry({
      name: "Sophia Taylor",
      email: "sophia@luxescreens.com",
      phone: "+91-9988776655",
      preferredLocation: "Koramangala, Bangalore",
      notes: "Looking for 12-person rooftop private theater",
    });
    assert(waitlistEntry.id > 0, "POST /api/waitlist saves lead capture entry", `Waitlist ID: #${waitlistEntry.id}`);

    console.log(`\n📊 Verification Summary: ${passed} PASSED, ${failed} FAILED.`);
  } catch (error) {
    console.error("Fatal error during verification:", error);
  }
}

runApiVerification();
