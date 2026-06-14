import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY ?? "";

export const stripe = new Stripe(secretKey, {
  apiVersion: "2024-09-30.acacia",
  typescript: true,
});

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY ?? "";
