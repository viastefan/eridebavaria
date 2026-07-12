"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";

function PaymentForm({
  orderNumber,
  onSuccess,
  onError,
}: {
  orderNumber: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
      },
    });
    if (error) {
      onError(error.message ?? "Zahlung fehlgeschlagen");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button onClick={pay} disabled={!stripe || loading} className="w-full">
        {loading ? "Zahlung wird verarbeitet …" : "Jetzt bezahlen"}
      </Button>
    </div>
  );
}

export function StripePayment({
  clientSecret,
  publishableKey,
  orderNumber,
  onSuccess,
  onError,
}: {
  clientSecret: string;
  publishableKey: string;
  orderNumber: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(publishableKey));
  }, [publishableKey]);

  if (!stripePromise) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm orderNumber={orderNumber} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
