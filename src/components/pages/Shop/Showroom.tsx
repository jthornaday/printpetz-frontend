import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { ArrowUpRight, Check } from "lucide-react";

import { PremiumFooter, PremiumHeader } from "@/components/shared/Premium";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEMO_PET_NAME, DEMO_PREVIEWS } from "@/constants/merch_demo";
import { MerchProduct, orderableProducts, shippingFor, TURNAROUND } from "@/constants/merch_products";
import { useGetGenerationViews } from "@/hooks/generation/useGetGenerationViews";
import { useGetUser } from "@/hooks/user/useGetUser";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes";
import { createCheckoutForGeneration } from "@/services/shopify/cart";
import { useGetMerchPreviewsQuery } from "@/store/api/merchApi";
import { EGenerationStatus } from "@/types/generation";
import { Personalization, PreviewImage } from "@/types/merch";

type Artwork = { id: number; image: string };

/** Wrap-around prints (pet bowl about 8:1, mug about 2.6:1) are much wider than tall. */
const isStrip = (p: { width: number; height: number }) => p.width / p.height > 2;

const OMITTED_REASON: Record<NonNullable<Personalization["omitted"]>, string> = {
  no_name: "your pet doesn’t have a name saved",
  unsupported_characters: "the name uses letters we can’t print yet",
  too_long: "the name is too long to fit",
};

/** The name as it will print, in words, so the picture is never the only clue. */
const nameNote = (pz: Personalization) => {
  if (!pz.lines) {
    return `Prints with portraits only: ${OMITTED_REASON[pz.omitted ?? "no_name"]}.`;
  }
  const name = pz.lines.join(" ");
  return pz.frontPortrait === false
    ? `Printed name: ${name}. It’s a long one, so it prints on its own across the front, with your pet’s portrait on each side.`
    : `Printed name: ${name}.`;
};

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

  // A skipped query (signed out) reports itself as loading forever, so only wait on artwork when signed in.
  const loading = isUserLoading || (Boolean(user) && isGenerationViewsLoading);

  // "Shop this image" links here with ?g=<id>. That image may be older than the picker has loaded,
  // so use the id directly (the backend checks ownership and returns the image URL) rather than
  // silently falling back to the newest image — the wrong pet on every product.
  const requested = Number(router.query.g);
  const requestedId = user && Number.isInteger(requested) && requested > 0 ? requested : null;
  const chosenId = requestedId ?? artworks[0]?.id ?? null;

  // Poll while the backend is still rendering (square products wait on background removal).
  const [pollMs, setPollMs] = useState(0);
  const { data, isError } = useGetMerchPreviewsQuery(chosenId ?? 0, { skip: !chosenId, pollingInterval: pollMs });
  const manifest = data?.data;
  const chosen: Artwork | null = chosenId === null ? null
    : artworks.find((a) => a.id === chosenId)
      ?? (manifest?.generationId === chosenId ? { id: chosenId, image: manifest.sourceUrl } : null);
  const isDemo = !loading && !chosenId;
  const pending = manifest ? manifest.complete === false : false;
  useEffect(() => setPollMs(pending ? 2000 : 0), [pending]);

  const previewFor = (key: string): PreviewImage | "pending" | null => {
    if (isDemo) return DEMO_PREVIEWS[key] ?? null;
    if (loading) return "pending";
    const e = manifest?.entries.find((x) => x.productKey === key && x.treatment === "panel");
    if (!e || e.status === "pending") return "pending";
    if (e.status !== "ready" || !e.url || !e.width || !e.height) return null;
    return { url: e.url, width: e.width, height: e.height, trimmed: e.trimmed, mockup: e.mockup, personalization: e.personalization };
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
                <button key={a.id} type="button" onClick={() => choose(a.id)} aria-pressed={a.id === chosenId}
                  className={cn("pp-picker-thumb", a.id === chosenId && "is-active")}>
                  <Image src={a.image} alt="" fill sizes="72px" className="object-cover" />
                  {a.id === chosenId && <span className="pp-picker-check"><Check size={14} /></span>}
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
        {!isDemo && manifest?.watermarked && (
          <div className="pp-shop-note">
            This image was made with free starter credits, so the previews show a watermark. <strong>Your product prints without it.</strong>
          </div>
        )}

        <ul className="pp-shop-trust" aria-label="Shipping and our promise">
          <li>Made to order, shipped to you in about 1–2 weeks</li>
          <li>US shipping from $6.95</li>
          <li><span>Damaged or wrong? <Link href={ROUTES.refunds} className="pp-inline-link">Free reprint or full refund</Link></span></li>
        </ul>

        <div className="pp-showroom-grid">
          {products.map((p) => {
            const prev = previewFor(p.key);
            return (
              <button key={p.key} type="button" className="pp-showroom-tile" disabled={!isDemo && !chosen} onClick={() => setOpenKey(p.key)}>
                <div className="pp-showroom-image">
                  {prev === "pending" ? (
                    <span className="pp-showroom-loading">Preparing your preview…</span>
                  ) : prev?.mockup ? (
                    <Image src={prev.mockup.url} alt={`${p.label} with ${isDemo ? DEMO_PET_NAME : "your artwork"}`} width={prev.mockup.width} height={prev.mockup.height}
                      className="pp-showroom-mockup" />
                  ) : prev ? (
                    <Image src={prev.url} alt={`${p.label} with ${isDemo ? DEMO_PET_NAME : "your artwork"}`} width={prev.width} height={prev.height}
                      className={cn("pp-showroom-print", (prev.width === prev.height || isStrip(prev)) && "is-square")} />
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
        <ProductDialog product={open} preview={previewFor(open.key)} artwork={isDemo ? null : chosen} watermarked={!isDemo && Boolean(manifest?.watermarked)}
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
  /** Preview shows the free-credit watermark; the product prints without it. */
  watermarked?: boolean;
  onClose: () => void;
};

const ProductDialog = ({ product, preview, artwork, signedIn, watermarked, onClose }: DialogProps) => {
  const [variantGid, setVariantGid] = useState(product.variants[0]?.variantGid ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<"product" | "print">("product");
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
            {ready && preview.mockup && (
              <div className="pp-view-toggle" role="tablist" aria-label="Preview view">
                <button type="button" role="tab" aria-selected={view === "product"} className={cn(view === "product" && "is-active")} onClick={() => setView("product")}>Product</button>
                <button type="button" role="tab" aria-selected={view === "print"} className={cn(view === "print" && "is-active")} onClick={() => setView("print")}>Exact print</button>
              </div>
            )}
            {ready && preview.mockup && view === "product" ? (
              <Image src={preview.mockup.url} alt={`${product.label} with the artwork`} width={preview.mockup.width} height={preview.mockup.height} className="pp-showroom-mockup" />
            ) : ready && isStrip(preview) ? (
              <StripPreview preview={preview} label={product.label} />
            ) : ready ? (
              <Image src={preview.url} alt={`${product.label} print preview`} width={preview.width} height={preview.height} className="pp-showroom-print" />
            ) : (
              <span className="pp-showroom-loading">{preview === "pending" ? "Preparing your preview…" : "Preview unavailable"}</span>
            )}
            <figcaption>
              {ready && preview.mockup && view === "product"
                ? `Shown on the product. Tap Exact print to see ${isStrip(preview) ? "the whole wrap, laid flat" : "the file we print"}.`
                : artwork ? "This is exactly what we print." : `Sample: ${DEMO_PET_NAME}.`}
              {ready && isStrip(preview) && (preview.mockup && view === "product"
                ? " It wraps all the way round; the ends meet at the back."
                : " Scroll sideways to see all the way round; the ends meet at the back.")}
              {ready && preview.trimmed >= 0.05 && ` The edges are trimmed to fit this ${product.label.toLowerCase()} — about ${Math.round(preview.trimmed * 100)}% of the image.`}
              {ready && preview.personalization && <strong className="pp-name-note">{nameNote(preview.personalization)}</strong>}
              {watermarked && <strong className="pp-name-note">Prints without the watermark.</strong>}
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
            <p className="pp-fine-print">
              {variant && shippingFor(variant.retailUsd) > 0 ? `+ $${shippingFor(variant.retailUsd).toFixed(2)} shipping` : "Free shipping"}, US only. {TURNAROUND}
            </p>
            <p className="pp-fine-print">
              Arrives damaged or wrong? We’ll reprint it free or give you a full refund. <Link href={ROUTES.refunds} className="pp-inline-link">Our promise</Link>
            </p>
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

/** A wrap-around print at a readable height, scrolled so the front of the product (the centre) shows first. */
const StripPreview = ({ preview, label }: { preview: PreviewImage; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const centre = () => {
    const el = ref.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  };
  useEffect(centre, [preview.url]);
  return (
    <div ref={ref} className="pp-strip-scroll">
      <Image src={preview.url} alt={`${label} print, laid flat`} width={preview.width} height={preview.height} className="pp-strip-print" onLoad={centre} />
    </div>
  );
};
