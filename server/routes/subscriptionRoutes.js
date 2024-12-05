const express = require("express");
const router = express.Router();
const Subscription = require("../models/userSubscriptions");
router.post("/create-subscription", async (req, res) => {
    const {
      subscription_name,
      cost: { monthly, yearly, custom_pricing },
      features: {
        storage,
        encryption,
        document_sharing,
        inheritance_features,
        integrations,
        automatic_photo_upload,
        support,
        extra_features,
      },
    } = req.body;
  
    try {
      
      const existingSubscription = await Subscription.findOne({ subscription_name });
      if (existingSubscription) {
        return res.status(400).json({ message: "Subscription with this name already exists." });
      }
  
      
      const newSubscription = new Subscription({
        subscription_name,
        cost: { monthly, yearly, custom_pricing },
        features: {
          storage,
          encryption,
          document_sharing,
          inheritance_features,
          integrations,
          automatic_photo_upload,
          support,
          extra_features,
        },
      });
  
      await newSubscription.save();
  
      res.status(201).json({
        message: "Subscription created successfully.",
        subscription: newSubscription,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Error creating subscription.", error: error.message });
    }
  });
  
router.get("/get-subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Error fetching subscriptions.", error: error.message });
  }
});
module.exports = router;
