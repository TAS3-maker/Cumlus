import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { API_URL } from "../utils/Apiconfig";
import {loadStripe} from '@stripe/stripe-js';
const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/subscriptions/get-subscriptions`);
        setSubscriptions(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching subscriptions. Please try again later.");
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleUpgradePlan = async (priceId, subscriptionName) => {
    const stripe = await loadStripe("pk_test_51QL7nCLN8J6rO1tf5uQJRmggnJy9bm48D7N8wkDfjLHRAO4AFB035NaMKxmfdEMHH0uquB0loA8NA2HItcQvukaU00ZYuNSMxt");
  console.log("priceId",priceId);
  console.log("subscriptionName",subscriptionName);
    const body = {
      planId: priceId, // Send the correct Stripe Price ID
      subscriptionName: subscriptionName, // Send the subscription name
    };
  
    try {
      const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const session = await response.json();
  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error during checkout session creation", error);
    }
  };
  




  if (loading) {
    return <div className="text-center p-8">Loading subscriptions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  const tableData = [
    { feature: "20 GB Storage", foundation: true, legacy: false, heritage: false },
    { feature: "Basic Inheritance", foundation: true, legacy: false, heritage: false },
    { feature: "Basic Document Sharing", foundation: true, legacy: false, heritage: false },
    { feature: "Standard Support", foundation: true, legacy: false, heritage: false },
    { feature: "Advanced Encryption", foundation: true, legacy: true, heritage: true },
    { feature: "Google Drive Integration", foundation: true, legacy: true, heritage: true },
    { feature: "Priority", foundation: false, legacy: true, heritage: false },
    { feature: "50 GB Storage", foundation: false, legacy: true, heritage: true },
    { feature: "Top Compliance Level Encryption", foundation: false, legacy: true, heritage: true },
    { feature: "Advance Sharing Controls", foundation: false, legacy: true, heritage: true },
    { feature: "Dropbox Integration", foundation: false, legacy: true, heritage: true },
    { feature: "Advance Inheritance Options", foundation:false, legacy: true, heritage: true },
    { feature: "Automatic Photo Upload", foundation: false, legacy: true, heritage: true },
    { feature: "Voice Memo", foundation: false, legacy: true, heritage: true },
    { feature: "Notepad", foundation: false, legacy: true, heritage: true },
    { feature: "Custom Inheritance Options", foundation: false, legacy: false, heritage: true },
    { feature: "Full Suite of Integration", foundation: false, legacy: false, heritage: true },
    { feature: "Custom Storage", foundation: false, legacy: false, heritage: true },
    { feature: "24/7 Dedicated Support", foundation: false, legacy: false, heritage: true },
    { feature: "Customizable Solutions", foundation: false, legacy: false, heritage: true },
  ];

  return (
    <>
      <div className="flex flex-col items-center p-8">
        <h2 className="text-2xl font-bold mb-4">Subscription</h2>
        <p className="text-gray-500 mb-8">Upgrade to Cumulus Premium for exclusive features!</p>

        {/* Subscription Plans Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((plan) => (
            <div
              key={plan._id}
              className="border rounded-md p-6 shadow-sm hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold mb-2">
                ${plan.cost.monthly ? `${plan.cost.monthly}/mo` : "Custom Pricing"}
              </h2>
              <h3 className="text-gray-600 mb-4">{plan.subscription_name}</h3>
              <ul className="mb-4">
                <li>
                  <strong>Storage:</strong> {plan.features.storage}
                </li>
                <li>
                  <strong>Encryption:</strong> {plan.features.encryption}
                </li>
                <li>
                  <strong>Document Sharing:</strong> {plan.features.document_sharing}
                </li>
                <li>
                  <strong>Inheritance Features:</strong> {plan.features.inheritance_features}
                </li>
                <li>
                  <strong>Integrations:</strong> {plan.features.integrations.join(", ")}
                </li>
                <li>
                  <strong>Extra Features:</strong> {plan.features.extra_features.join(", ")}
                </li>
              </ul>
              <button
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleUpgradePlan(plan.cost.monthly, plan.subscription_name)}  
              >
                {plan.cost.monthly ? "Upgrade Plan" : "Contact Us"}
              </button>
            </div>
          ))}
        </div>

        {/* Table of Features */}
        <div className="overflow-x-auto min-h-screen flex justify-center my-4 mb-10 mx-1 md:mx-20">
        <table className="table-auto min-w-full border border-gray-300 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="md:px-4 py-2">Features</th>
                <th className="md:px-4 py-2">Foundation (Standard)</th>
                <th className="md:px-4 py-2">Legacy (Premium)</th>
                <th className="md:px-4 py-2">Heritage (Enterprise)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="md:px-4 py-2">{row.feature}</td>
                  <td className="md:px-4 py-2 text-center">
                    {row.foundation ? <Check className=" text-center text-green-500 font-bold" /> : ""}
                  </td>
                  <td className="md:px-4 py-2 text-center">
                    {row.legacy ? <Check className=" text-center text-green-500 text-lg font-bold" /> : ""}
                  </td>
                  <td className="md:px-4 py-2 text-center">
                    {row.heritage ? <Check className=" text-center text-green-500 font-bold" /> : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Subscription;
