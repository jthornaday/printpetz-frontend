import { useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MerchProduct, TREATMENTS, Treatment, orderableProducts } from "@/constants/merch_products";
import { createCheckoutForGeneration } from "@/services/shopify/cart";
import { shopifyConfigured } from "@/services/shopify/client";

type Props = {
  open: boolean;
  onClose: () => void;
  generationImage: string | null;
  generationId: number | string;
};

export const OrderPrintDialog = ({ open, onClose, generationImage, generationId }: Props) => {
  const products = useMemo(() => orderableProducts(), []);
  const [productKey, setProductKey] = useState<string | null>(products[0]?.key ?? null);
  const [treatment, setTreatment] = useState<Treatment>("panel");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected: MerchProduct | undefined = products.find((p) => p.key === productKey);
  const canOrder = Boolean(generationImage) && Boolean(selected?.variantGid) && !isSubmitting;

  const handleCheckout = async () => {
    if (!selected?.variantGid || !generationImage) return;
    setIsSubmitting(true);
    try {
      const url = await createCheckoutForGeneration({
        variantGid: selected.variantGid,
        quantity: 1,
        generationUrl: generationImage,
        generationId,
        productKey: selected.key,
        treatment,
      });
      window.location.assign(url);
    } catch (e) {
      toast.error((e as Error).message || "Could not start checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Nothing is orderable until the Shopify products exist and their variant ids are
  // filled into merch_products.ts. Say so plainly rather than showing a dead button.
  const notReady = !shopifyConfigured() || products.length === 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Put this on something</DialogTitle>
          <DialogDescription>We print the artwork exactly as you see it here.</DialogDescription>
        </DialogHeader>

        {notReady ? (
          <p className="text-sm text-muted-foreground py-6">
            Physical products aren&apos;t available just yet. Hang tight — they&apos;re coming.
          </p>
        ) : (
          <div className="space-y-5">
            {generationImage && (
              <div className="relative h-32 w-full overflow-hidden rounded-md bg-muted">
                <Image src={generationImage} alt="Your artwork" fill className="object-contain" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Product</Label>
              <div className="grid grid-cols-2 gap-2">
                {products.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setProductKey(p.key)}
                    className={cn(
                      "rounded-md border p-3 text-left transition",
                      productKey === p.key
                        ? "border-primary ring-1 ring-primary"
                        : "hover:border-muted-foreground/40"
                    )}
                  >
                    <span className="block text-sm font-medium">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.blurb}</span>
                    {p.retailUsd !== null && (
                      <span className="mt-1 block text-sm">${p.retailUsd.toFixed(2)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <RadioGroup
                value={treatment}
                onValueChange={(v) => setTreatment(v as Treatment)}
                className="grid grid-cols-2 gap-2"
              >
                {TREATMENTS.map((t) => (
                  <label
                    key={t.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border p-3 transition",
                      treatment === t.value
                        ? "border-primary ring-1 ring-primary"
                        : "hover:border-muted-foreground/40"
                    )}
                  >
                    <RadioGroupItem value={t.value} className="mt-0.5" />
                    <span>
                      <span className="block text-sm font-medium">{t.label}</span>
                      <span className="block text-xs text-muted-foreground">{t.blurb}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Button className="w-full" disabled={!canOrder} onClick={handleCheckout}>
              {isSubmitting ? "Taking you to checkout…" : "Continue to checkout"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Checkout is handled securely by Shopify.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
