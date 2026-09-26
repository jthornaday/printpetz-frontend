import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MerchProduct, MerchVariant, TREATMENTS, Treatment, orderableProducts,
} from "@/constants/merch_products";
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
  const [variantGid, setVariantGid] = useState<string | null>(products[0]?.variants[0]?.variantGid ?? null);
  const [treatment, setTreatment] = useState<Treatment>("panel");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected: MerchProduct | undefined = products.find((p) => p.key === productKey);
  const variant: MerchVariant | undefined =
    selected?.variants.find((v) => v.variantGid === variantGid) ?? selected?.variants[0];

  // Switching product resets the size, or the previous product's variant sticks and
  // the customer buys the wrong thing.
  useEffect(() => {
    if (selected && !selected.variants.some((v) => v.variantGid === variantGid)) {
      setVariantGid(selected.variants[0]?.variantGid ?? null);
    }
  }, [selected, variantGid]);

  const canOrder = Boolean(generationImage) && Boolean(variant?.variantGid) && !isSubmitting;

  const handleCheckout = async () => {
    if (!variant?.variantGid || !selected || !generationImage) return;
    setIsSubmitting(true);
    try {
      const url = await createCheckoutForGeneration({
        variantGid: variant.variantGid,
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

  const notReady = !shopifyConfigured() || products.length === 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Put this on something</DialogTitle>
          <DialogDescription>Your pet is printed as-is, never redrawn. The coaster, pillow, and can cooler trim the edges to fit their shape.</DialogDescription>
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
                      productKey === p.key ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground/40",
                    )}
                  >
                    <span className="block text-sm font-medium">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.blurb}</span>
                    <span className="mt-1 block text-sm">
                      {p.variants.length > 1 ? "from " : ""}
                      ${Math.min(...p.variants.map((v) => v.retailUsd)).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {selected && selected.variants.length > 1 && (
              <div className="space-y-2">
                <Label>Size</Label>
                <div className="flex flex-wrap gap-2">
                  {selected.variants.map((v) => (
                    <button
                      key={v.variantGid}
                      type="button"
                      onClick={() => setVariantGid(v.variantGid)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm transition",
                        variant?.variantGid === v.variantGid
                          ? "border-primary ring-1 ring-primary"
                          : "hover:border-muted-foreground/40",
                      )}
                    >
                      {v.label} · ${v.retailUsd.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                      treatment === t.value ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground/40",
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
              {isSubmitting
                ? "Taking you to checkout…"
                : variant
                  ? `Continue to checkout · $${variant.retailUsd.toFixed(2)}`
                  : "Continue to checkout"}
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
