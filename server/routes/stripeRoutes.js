const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51QL7nCLN8J6rO1tfzdJANPQMx7jSpl7EZhaRhe5HZdYMs9wQjn4CXVCaOWBtchXLsUjGlV10jE6axwYPdr89GPjn00DiES6QEg');
require("dotenv").config();

router.post("/create-checkout-session", async (req, res) => {
  const { planId, subscriptionName } = req.body;
  console.log("priceId",planId);
  if (!planId || !subscriptionName) {
    return res.status(400).json({ error: "planId and subscriptionName are required." });
  }

  try {
 
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: subscriptionName,
            images: [], // Ensure images exist
          },
          unit_amount: planId * 100, // Ensure price is in paise
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/Enterdashboard", // Replace with your success page URL
      cancel_url: "http://localhost:3000/cancel",  // Replace with your cancel page URL
      metadata: {
        subscription_name: subscriptionName,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});



module.exports = router;
