import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY ?? "";

// 省略 apiVersion：让 Stripe SDK 使用默认兼容版本
export const stripe = new Stripe(secretKey, {
  typescript: true,
});

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY ?? "";
