import React, { useState } from "react";
import { PlanCard } from "./components/PlanCard";
import { FeaturePill } from "./components/FeaturePill";
import { useGetPricesQuery } from "@/store/api/priceApi";
import { Loader } from "@/components/ui/loader";
import { useCreateCheckoutSessionMutation } from "@/store/api/paymentApi";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";

const features = ["Access to all styles", "Unlimited storage", "Download anytime"];

export const Plan = () => {
  const { data: prices = [], isLoading } = useGetPricesQuery({});

  const { toast } = useToast();
  const [createCheckoutSession, { isLoading: isCreatingCheckoutSession }] =
    useCreateCheckoutSessionMutation();

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handlePurchase = async (priceId: string) => {
    if (!priceId) return;

    setSelectedPriceId(priceId);

    try {
      const { success, data, message } = await createCheckoutSession({ priceId }).unwrap();
      if (!success || !data) {
        toast(EToastType.ERROR, message ?? "Something went wrong");
        setSelectedPriceId(null);
        return;
      }
      window.location.href = data.session.url;
    } catch (error) {
      // A refused checkout (pack retired, wrong mode) arrives as an HTTP error, which unwrap() throws.
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast(EToastType.ERROR, message ?? "We couldn't start checkout. Please refresh and try again.");
      setSelectedPriceId(null);
    }
  };

  return (
    <main className="w-full py-10 px-5 overflow-auto">
      <div className="min-h-full flex flex-col justify-center gap-8">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-black">Buy credits</h1>
          <div className="mt-6">
            <h2 className="text-2xl text-black-20 font-bold">Start Generating Pet Magic</h2>
            <p className="mt-2 text-black-40 max-w-2xl mx-auto">
              Use credits to create high-quality portraits of your pet in fun and professional
              styles. No subscriptions: buy only what you need.
            </p>
            <p className="mt-2 text-black-40 max-w-2xl mx-auto">
              Buying any pack also removes the watermark from images you made with free starter credits.
            </p>
          </div>
        </section>

        {/* Plan cards row */}
        <section className="mt-12 flex flex-wrap items-center lg:items-end justify-center gap-8">
          {isLoading ? (
            <div className="w-full min-h-[290px] flex items-center justify-center">
              <Loader size={32} />
            </div>
          ) : prices.length === 0 ? (
            <p className="w-full text-center text-black-40">
              Credit packs aren&apos;t available right now. Please check back soon.
            </p>
          ) : (
            prices.map((price) => (
              <PlanCard
                key={price.id}
                price={price}
                onSelect={() => handlePurchase(price.price_id)}
                isLoading={isCreatingCheckoutSession}
                selectedPriceId={selectedPriceId}
              />
            ))
          )}
        </section>

        {/* Feature list */}
        <section className="mt-12 flex items-center justify-center">
          <div className="w-full text-nowrap max-w-4xl bg-white border border-[#e7e2ee] px-8 py-6 rounded-3xl flex flex-wrap items-center justify-center gap-6 shadow-[0_14px_40px_rgba(52,41,91,.08)]">
            {features.map((feature) => (
              <FeaturePill key={feature} feature={feature} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
