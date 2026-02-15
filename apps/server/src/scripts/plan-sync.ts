import Razorpay from "razorpay";
import { db } from "@repo/db"; 
import { planMappings } from "@repo/db/schema/core-schema";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function syncPlans() {
  const amounts = await db.query.contributionAmountOptions.findMany();
  const frequencies = await db.query.contributionFrequencyOptions.findMany();

  for (const amt of amounts) {
    for (const freq of frequencies) {
      
      // 1. Check mapping table for this specific combination
      const existingMapping = await db.query.planMappings.findFirst({
        where: (m, { eq, and }) => and(
          eq(m.amount, amt.amount),
          eq(m.frequency, freq.frequency)
        )
      });

      if (!existingMapping) {
        const period = freq.frequency.toLowerCase() as "daily" | "weekly" | "monthly" | "yearly";
        
        try {
          // 2. Create the unique plan (Amount + Frequency)
          const plan = await razorpay.plans.create({
            period,
            interval: 1,
            item: {
              name: `${freq.frequency} Plan - ₹${amt.amount}`,
              amount: Math.round(Number(amt.amount) * 100),
              currency: "INR",
            }
          });

          // 3. Insert into mapping table
          await db.insert(planMappings).values({
            amount: amt.amount,
            frequency: freq.frequency,
            razorpayPlanId: plan.id
          });
            
          console.log(`✅ Created ${period} plan for ₹${amt.amount}: ${plan.id}`);
        } catch (error: any) {
          console.error(`❌ Skip/Error for ₹${amt.amount} ${period}:`, error.message);
        }
      }
    }
  }
}

syncPlans()
  .then(() => {
    console.log("✨ All plans synced successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("💥 Sync failed:", err);
    process.exit(1);
  });