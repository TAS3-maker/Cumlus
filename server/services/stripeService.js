// backend/services/stripeService.js

const stripe = require('stripe')('sk_test_51QL7nCLN8J6rO1tfzdJANPQMx7jSpl7EZhaRhe5HZdYMs9wQjn4CXVCaOWBtchXLsUjGlV10jE6axwYPdr89GPjn00DiES6QEg');

exports.createCheckoutSession = async (sessionData) => {
  try {
    const session = await stripe.checkout.sessions.create(sessionData);
    return session;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.handleWebhook = async (event) => {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Handle successful payment
    console.log(`Checkout session completed: ${session.id}`);
    // Return or process session data as needed
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }
};

