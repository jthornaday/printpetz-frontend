import React, { useState } from "react";
import { PlanCard } from "./components/PlanCard";
import { FeaturePill } from "./components/FeaturePill";
import { useGetPricesQuery } from "@/store/api/priceApi";
import { Loader } from "@/components/ui/loader";
import { useCreateCheckoutSessionMutation } from "@/store/api/paymentApi";
import { useToast } from "@/hooks/useToast";
import { EToastType } from "@/types/toast";

const features = ["Access to all styles", "Unlimited storage", "Download anytime"];

export const Pricing = () => {
  const { data: prices = [], isLoading } = useGetPricesQuery({});

  const { toast } = useToast();
  const [createCheckoutSession, { isLoading: isCreatingCheckoutSession }] =
    useCreateCheckoutSessionMutation();

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handlePurchase = async (priceId: string) => {
    if (!priceId) return;

    setSelectedPriceId(priceId);

    const { success, data, message } = await createCheckoutSession({ priceId }).unwrap();
    if (!success || !data) {
      toast(EToastType.ERROR, message ?? "Something went wrong");
      return;
    }

    window.location.href = data.session.url;
    setSelectedPriceId(null);
  };

  return (
    <main className="w-full py-10 px-5 overflow-auto">
      <div className="min-h-full flex flex-col justify-center gap-8">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-black">Choose your plan</h1>
          <div className="mt-6">
            <h2 className="text-2xl text-black-20 font-bold">Start Generating Pet Magic</h2>
            <p className="mt-2 text-black-40 max-w-2xl mx-auto">
              Use credits to create unlimited, high-quality AI images of your pet in fun and
              professional styles. No subscriptions. No cloud limits. Just pure creativity.
            </p>
          </div>
        </section>

        {/* Pricing cards row */}
        <section className="mt-12 flex flex-wrap items-center lg:items-end justify-center gap-8">
          {isLoading ? (
            <div className="w-full min-h-[290px] flex items-center justify-center">
              <Loader size={32} />
            </div>
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
          <div className="w-full text-nowrap max-w-4xl bg-[#111217]/40 backdrop-blur-xl border border-gray-800/50 px-8 py-6 rounded-3xl flex flex-wrap items-center justify-center gap-6">
            {features.map((feature) => (
              <FeaturePill key={feature} feature={feature} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
