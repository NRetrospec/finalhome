import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import "./index.css";
import App from "./App";

console.log("Convex URL:", import.meta.env.VITE_CONVEX_URL);
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </ConvexAuthProvider>,
);
