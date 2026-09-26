import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { ArrowUpRight, Check } from "lucide-react";

import { PremiumFooter, PremiumHeader } from "@/components/shared/Premium";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEMO_PET_NAME, DEMO_PREVIEWS } from "@/constants/merch_demo";
import { MerchProduct, orderableProducts } from "@/constants/merch_products";
import { useGetGenerationViews } from "@/hooks/generation/useGetGenerationViews";
import { useGetUser } from "@/hooks/user/useGetUser";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { createCheckoutForGeneration } from "@/services/shopify/cart";
import { useGetMerchPreviewsQuery } from "@/store/api/merchApi";
import { EGenerationStatus } from "@/types/generation";
import { PreviewImage } from "@/types/merch";

type Artwork = { id: number; image: string };

const priceLabel = (p: MerchProduct) => {
  const prices = p.variants.map((v) => v.retailUsd);
  const min = Math.min(...prices);
  return `${prices.length > 1 ? "from " : ""}$${min.toFixed(0)}`;
};

/**
 * The showroom: every product, each showing the chosen artwork exactly as it will
 * print (same crop as the print file, rendered by the backend). Signed-out visitors
 * and people without artwork see Max as a clearly labelled sample they can't buy.
 */
export const Showroom = () => {
  const router = useRouter();
  const { user, isUserLoading } = useGetUser();
  const { generationViews, isGenerationViewsLoading } = useGetGenerationViews(user?.id);
  const products = useMemo(() => orderableProducts(), []);

  const artworks: Artwork[] = useMemo(
    () => generationViews.flatMap((v) => v.generations)
      .filter((g) => g.status === EGenerationStatus.COMPLETED && g.image)
      .map((g) => ({ id: g.id, image: g.image as string })),
    [generationViews],
  );

  const requested = Number(router.query.g);
  const chosen = artworks.find((a) => a.id === requested) ?? artworks[0] ?? null;
  // A skipped query (signed out) reports itself as loading forever, so only wait on artwork when signed in.
  const loading = isUserLoading || (Boolean(user) && isGenerationViewsLoading);
  const isDemo = !loading && !chosen;

  // Poll while the backend is still rendering (square products wait on background removal).
  const [pollMs, setPollMs] = useState(0);
  const { data, isError } = useGetMerchPreviewsQuery(chosen?.id ?? 0, { skip: !chosen, pollingInterval: pollMs });
  const manifest = data?.data;
  const pending = manifest?.entries.some((e) => e.treatment === "panel" && e.status === "pending") ?? false;
  useEffect(() => setPollMs(pending ? 2000 : 0), [pending]);

  const previewFor = (key: string): PreviewImage | "pending" | null => {
    if (isDemo) return DEMO_PREVIEWS[key] ?? null;
    if (loading) return "pending";
    const e = manifest?.entries.find((x) => x.productKey === key && x.treatment === "panel");
    if (!e || e.status === "pending") return "pending";
    if (e.status !== "ready" || !e.url || !e.width || !e.height) return null;
    return { url: e.url, width: e.width, height: e.height, trimmed: e.trimmed };
  };

  const [openKey, setOpenKey] = useState<string | null>(null);
  const open = products.find((p) => p.key === openKey) ?? null;

  const choose = (id: number) => {
    void router.replace({ pathname: ROUTES.shop, query: { ...router.query, g: id } }, undefined, { shallow: true, scroll: false });
  };

  return (
    <div className="pp-site pg-site">
      <Head><title>Shop | PrintPetz</title></Head>
      <PremiumHeader />
      <main className="pp-wrap pp-showroom">
        <p className="pp-eyebrow">THE SHOP</p>
        <h1>Their portrait.<br /><em>On everything they deserve.</em></h1>
        <p className="pp-intro">
          {isDemo || loading
            ? `Here’s ${DEMO_PET_NAME}, our studio mascot, on every product. Create your pet’s portrait and you’ll see it here instead.`
            : "Every product below shows your artwork exactly as it will print. Pick a different image and they all update."}
        </p>

        {!isDemo && artworks.length > 0 && (
          <section className="pp-picker" aria-label="Choose your image">
            <p className="pp-picker-label">Your image</p>
            <div className="pp-picker-strip">
              {artworks.slice(0, 40).map((a) => (
                <button key={a.id} type="button" onClick={() => choose(a.id)} aria-pressed={a.id === chosen?.id}
                  className={cn("pp-picker-thumb", a.id === chosen?.id && "is-active")}>
                  <Image src={a.image} alt="" fill sizes="72px" className="object-cover" />
                  {a.id === chosen?.id && <span className="pp-picker-check"><Check size={14} /></span>}
                </button>
              ))}
            </div>
          </section>
        )}

        {isDemo && (
          <div className="pp-shop-note">
            Sample shown: {DEMO_PET_NAME}. <Link href={user ? ROUTES.create : ROUTES.signup} className="pp-inline-link">Create your pet’s portrait</Link> to see it on every product.
          </div>
        )}
        {isError && !isDemo && (
          <div className="pp-shop-note">We couldn’t load the previews just now. Refresh to try again.</div>
        )}

        <div className="pp-showroom-grid">
          {products.map((p) => {
            const prev = previewFor(p.key);
            return (
              <button key={p.key} type="button" className="pp-showroom-tile" onClick={() => setOpenKey(p.key)}>
                <div className="pp-showroom-image">
                  {prev === "pending" ? (
                    <span className="pp-showroom-loading">Preparing your preview…</span>
                  ) : prev ? (
                    <Image src={prev.url} alt={`${p.label} with ${isDemo ? DEMO_PET_NAME : "your artwork"}`} width={prev.width} height={prev.height}
                      className={cn("pp-showroom-print", prev.width === prev.height && "is-square")} />
                  ) : (
                    <span className="pp-showroom-loading">Preview unavailable</span>
                  )}
                  {isDemo && <span className="pp-sample-badge">Sample</span>}
                </div>
                <span className="pp-showroom-name">{p.label}</span>
                <span className="pp-showroom-meta">{p.sizeNote} · {priceLabel(p)}</span>
              </button>
            );
          })}
        </div>
      </main>
      <PremiumFooter />

      {open && (
        <ProductDialog product={open} preview={previewFor(open.key)} artwork={isDemo ? null : chosen}
          signedIn={Boolean(user)} onClose={() => setOpenKey(null)} />
      )}
    </div>
  );
};

type DialogProps = {
  product: MerchProduct;
  preview: PreviewImage | "pending" | null;
  artwork: Artwork | null;
  signedIn: boolean;
  onClose: () => void;
};

const ProductDialog = ({ product, preview, artwork, signedIn, onClose }: DialogProps) => {
  const [variantGid, setVariantGid] = useState(product.variants[0]?.variantGid ?? "");
  const [submitting, setSubmitting] = useState(false);
  const variant = product.variants.find((v) => v.variantGid === variantGid) ?? product.variants[0];
  const ready = preview && preview !== "pending";

  const buy = async () => {
    if (!artwork || !variant) return;
    setSubmitting(true);
    try {
      const url = await createCheckoutForGeneration({
        variantGid: variant.variantGid, quantity: 1, generationUrl: artwork.image,
        generationId: artwork.id, productKey: product.key, treatment: "panel",
      });
      window.location.assign(url);
    } catch (e) {
      toast.error((e as Error).message || "Could not start checkout. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.label}</DialogTitle>
          <DialogDescription>{product.blurb} {product.sizeNote}.</DialogDescription>
        </DialogHeader>
        <div className="pp-product-detail">
          <figure className="pp-product-detail-image">
            {ready ? (
              <Image src={preview.url} alt={`${product.label} print preview`} width={preview.width} height={preview.height} className="pp-showroom-print" />
            ) : (
              <span className="pp-showroom-loading">{preview === "pending" ? "Preparing your preview…" : "Preview unavailable"}</span>
            )}
            <figcaption>
              {artwork ? "This is exactly what we print." : `Sample: ${DEMO_PET_NAME}.`}
              {ready && preview.trimmed >= 0.05 && ` The edges are trimmed to fit this ${product.label.toLowerCase()} — about ${Math.round(preview.trimmed * 100)}% of the image.`}
            </figcaption>
          </figure>
          <div className="pp-product-detail-buy">
            {product.variants.length > 1 && (
              <div className="pp-size-picker" role="radiogroup" aria-label="Size">
                {product.variants.map((v) => (
                  <button key={v.variantGid} type="button" role="radio" aria-checked={v.variantGid === variant?.variantGid}
                    className={cn("pp-size", v.variantGid === variant?.variantGid && "is-active")} onClick={() => setVariantGid(v.variantGid)}>
                    {v.label} · ${v.retailUsd.toFixed(2)}
                  </button>
                ))}
              </div>
            )}
            <p className="pp-product-price">${variant?.retailUsd.toFixed(2)}</p>
            <p className="pp-fine-print">Printed and shipped for you. Free shipping on orders over $100.</p>
            {artwork ? (
              <button type="button" className="pp-button" disabled={!ready || submitting} onClick={buy}>
                {submitting ? "Taking you to checkout…" : "Buy now"} <ArrowUpRight size={17} />
              </button>
            ) : (
              <Link className="pp-button" href={signedIn ? ROUTES.create : ROUTES.signup}>
                Make one with your pet <ArrowUpRight size={17} />
              </Link>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
