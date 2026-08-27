import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/user/useGetUser";
import { ROUTES } from "@/routes";
import { IPrice } from "@/types/price";
import { useRouter } from "next/router";

interface Props {
  price: IPrice;
  onSelect: () => void;
  isLoading: boolean;
  selectedPriceId: string | null;
}

export const PlanCard = ({ price, onSelect, isLoading, selectedPriceId }: Props) => {
  const router = useRouter();

  const { user } = useGetUser();

  const handleUserPurchase = () => {
    if (!user) {
      router.push(ROUTES.login);
      return;
    }

    onSelect();
  };

  const baseAmountPerCredit = 0.1; // base plan amount per credit
  const currentAmountPerCredit = price.amount / price.credits;
  const savingPercentage = Number(
    (((baseAmountPerCredit - currentAmountPerCredit) / baseAmountPerCredit) * 100).toFixed(0)
  );

  return (
    <div
      className={`relative rounded-3xl w-80 border backdrop-blur-xl overflow-hidden flex flex-col border-black-70 shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)] transition-all duration-300
        ${
          price.is_most_popular
            ? "scale-[1.02] bg-gradient-to-br from-primary/40 to-black-100"
            : "bg-black-100"
        }
      `}
    >
      {/* Top badge */}
      {price.is_most_popular && (
        <div className="absolute top-0 left-0 right-0 text-center py-1.5 bg-primary text-white text-xs font-semibold">
          Most Popular
        </div>
      )}

      <div
        className={`flex justify-between items-center ${
          price.is_most_popular ? "mt-7" : ""
        } px-6 py-6`}
      >
        <div>
          <h3 className="text-[#171524] text-xl font-bold">{price.name}</h3>
          <p className="text-black-40 text-sm mt-1">{price.description}</p>
        </div>

        {/* Saving percentage batch */}
        {savingPercentage > 0 && (
          <div
            className={`px-2.5 py-1 text-xs rounded-full ${
              price.is_most_popular ? "text-white bg-primary" : "text-primary border border-primary"
            }`}
          >
            Save {savingPercentage}%
          </div>
        )}
      </div>

      <div className="h-[1px] bg-black-70" />

      <div className="px-6 pt-6 flex items-end justify-between">
        <div>
          <div className="text-5xl font-bold leading-none">${price.amount}</div>
        </div>
        <div className="text-right">
          <div className="text-[#171524] font-semibold">{price.credits} Credits</div>
          <div className="text-black-40 text-xs">
            ${currentAmountPerCredit.toFixed(2)} per credit
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 mb-6">
        <Button
          variant={price.is_most_popular ? "default" : "secondary"}
          className="w-full"
          disabled={isLoading}
          loading={isLoading && selectedPriceId === price.price_id}
          onClick={handleUserPurchase}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};
