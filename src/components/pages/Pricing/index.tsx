import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmationDialog";
import { useUpdateUserMutation, useGetUserByIdQuery } from "@/store/api/userApi";
import { useAppSelector } from "@/store";
import React, { useState } from "react";

// Local hero image (user provided)
const HERO_IMG = "/mnt/data/c90c09b2-fc2f-4cc7-a447-13e4d793c960.png";

// Small presentational components
// const Badge = ({ children }) => (
//   <span className="inline-block bg-purple-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
//     {children}
//   </span>
// );

// const Price = ({ amount }) => <div className="text-4xl font-extrabold leading-none">${amount}</div>;

// const CTAButton = ({ children, variant = "primary" }) => {
//   const base = "rounded-lg px-6 py-3 font-semibold shadow-lg w-full";
//   const styles =
//     variant === "primary"
//       ? `${base} bg-violet-500 text-white hover:bg-violet-600`
//       : `${base} bg-gray-800 text-gray-200 hover:bg-gray-700`;
//   return <button className={styles}>{children}</button>;
// };

type Props = {
  title: string;
  subtitle: string;
  price: number;
  credits: number;
  perCredit: string;
  badge?: string;
  highlighted?: boolean;
};

const PlanCard = ({ title, subtitle, price, credits, perCredit, badge, highlighted }: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { refetch } = useGetUserByIdQuery(user?.id || "", { skip: !user });

  const handlePurchase = async () => {
    if (!user) return false;

    try {
      await updateUser({
        id: user.id,
        updates: {
          credit: user.credit + credits,
        },
      }).unwrap();

      // Refetch user to update the UI
      await refetch();

      return true;
    } catch (error) {
      console.error("Failed to update credits:", error);
      return false;
    }
  };

  return (
    <div
      className={`relative rounded-3xl w-80 border backdrop-blur-xl overflow-hidden flex flex-col shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)] transition-all duration-300
        ${
          highlighted
            ? "bg-[#1a1b27]/80 border-violet-500/40 scale-[1.02]"
            : "bg-[#111217]/60 border-gray-800/60"
        }
      `}
    >
      {/* Top badge */}
      {badge && (
        <div className="absolute top-0 left-0 right-0 text-center py-2 bg-violet-500 text-white text-xs font-semibold rounded-t-3xl">
          {badge}
        </div>
      )}

      <div className={`${badge ? "mt-10" : "mt-6"} px-6`}>
        <h3 className="text-white text-xl font-bold">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      </div>

      <div className="px-6 mt-6 border-t border-gray-800/60 pt-6 flex items-end justify-between">
        <div>
          <div className="text-5xl font-extrabold leading-none">${price}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-200 font-semibold">{credits} Credits</div>
          <div className="text-gray-500 text-xs">{perCredit} per credit</div>
        </div>
      </div>

      <div className="px-6 mt-6 mb-6">
        <ConfirmationDialog
          title="Confirm Purchase"
          description={`Are you sure you want to purchase ${credits} credits for $${price}? This will add ${credits} credits to your account.`}
          confirmText="Confirm Purchase"
          cancelText="Cancel"
          onConfirm={handlePurchase}
          isLoading={isLoading}
          trigger={
            <Button variant={highlighted ? "default" : "secondary"} className="w-full">
              Get Started
            </Button>
          }
        />
      </div>
    </div>
  );
};

const FeaturePill = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 bg-[#121317]/60 border border-gray-800/60 px-6 py-3 rounded-2xl">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#7C5CFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-gray-200">{children}</span>
  </div>
);

export const Pricing = () => {
  return (
    <main className="w-full flex flex-col justify-center gap-8 py-10 overflow-auto">
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
      <section className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
        <PlanCard
          title="Starter Pack"
          subtitle="Great for light use"
          price={10}
          credits={100}
          perCredit="$0.10"
        />

        <PlanCard
          title="Pro Pack"
          subtitle="Ideal for regular users"
          price={18}
          credits={200}
          perCredit="$0.09"
          badge="Most Popular"
          highlighted
        />

        <PlanCard
          title="Ultimate Pack"
          subtitle="Best for pros & pet fans"
          price={40}
          credits={500}
          perCredit="$0.08"
        />
      </section>

      {/* Feature list */}
      <section className="mt-12 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-[#111217]/40 backdrop-blur-xl border border-gray-800/50 px-8 py-6 rounded-3xl flex items-center justify-between gap-6">
          <FeaturePill>Access to all styles</FeaturePill>
          <FeaturePill>Unlimited storage</FeaturePill>
          <FeaturePill>Download anytime</FeaturePill>
        </div>
      </section>
    </main>
  );
};
