const express = require("express");
const mongoose = require("mongoose");
const { Userlogin } = require("../models/userModel"); // Import the User model
const { authenticateToken } = require("../routes/userRoutes"); 
const Subscription = require('../models/userSubscriptions'); 
const router = express.Router();
router.post("/add-membership-details", authenticateToken, async (req, res) => {
  console.log("Membership update API called.");
  try {
    // Extract user ID from token
    const user_id = req.user ? req.user.user_id : null;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User ID not found in token." });
    }
    const { subscription_id, planTime } = req.body;
    if (!subscription_id || !planTime) {
      return res.status(400).json({ error: "Missing required fields: subscription_id or planTime." });
    }
    // Find the user by ID
    const user = await Userlogin.findById(user_id).populate("memberships.subscription_id");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Ensure memberships array exists
    if (!user.memberships) {
      user.memberships = [];
    }
    // Automatically set the buying date as the current date
    const buyingDate = new Date();
    // Add the membership details to the user's memberships array
    user.memberships.push({
      subscription_id,
      buyingDate,
      planTime,
    });
    await user.save();
    await user.populate("memberships.subscription_id");
    res.status(200).json({
      message: "Membership details added successfully",
      memberships: user.memberships,
    });
  } catch (error) {
    console.error("Error adding membership details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
