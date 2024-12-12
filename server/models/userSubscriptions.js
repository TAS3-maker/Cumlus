const mongoose = require("mongoose");
const SubscriptionSchema = new mongoose.Schema({
  subscription_name: {
    type: String,
    required: true,
    unique: true,
  },
  cost: {
    monthly: {
      type: String,
      default: null,
    },
    yearly: {
      type: String,
      default: null, 
    },
    custom_pricing: {
      type: Boolean,
      default: false, 
    },
  },
  features: {
    storage: {
      type: String,
      required: true,
    },
    encryption: {
      type: String,
      required: true,
    },
    document_sharing: {
      type: String,
      required: true,
    },
    inheritance_features: {
      type: String,
      required: true,
    },
    integrations: {
      type: [String],
      default: [],
    },
    automatic_photo_upload: {
      type: Boolean,
      default: false,
    },
    support: {
      type: String,
      default: "Email support",
    },
    extra_features: {
      type: [String],
      default: [],
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const Subscription = mongoose.model("Subscription", SubscriptionSchema);
module.exports = Subscription;