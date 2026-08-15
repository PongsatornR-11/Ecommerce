import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "../stripe.css";
import { saveOrder } from "../api/user";
import useEcomStore from "../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";

export default function CheckoutForm({ dpmCheckerLink }) {
  const navigate = useNavigate();
  const clearCart = useEcomStore((state) => state.actionClearCart);

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (payload.error) {
        setMessage(payload.error.message || "An unexpected error occurred.");
        toast.error(payload.error.message || "Payment failed");
      } else if (payload.paymentIntent?.status === "succeeded") {
        await saveOrder(payload);
        clearCart();
        toast.success("Order confirmed successfully!");
        navigate("/user/history");
      } else {
        toast.info(`Payment status: ${payload.paymentIntent?.status}`);
      }
    } catch (err) {
      console.error("Order completion error:", err);
      toast.error(err.response?.data?.message || "Failed to process order confirmation");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 my-8">
      <div className="flex items-center space-x-2 text-indigo-600 mb-6 font-semibold">
        <Lock className="w-5 h-5" />
        <span>Secure Encrypted Payment</span>
      </div>

      <form className="space-y-6" id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        
        <button
          className="w-full mt-6 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors cursor-pointer"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <span className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Complete Payment</span>
            </span>
          )}
        </button>

        {message && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200" id="payment-message">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}