import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  darkText?: boolean;
  /** Max sitting before "Print" and the baseball-Max shirt after "Petz". */
  bookends?: boolean;
  /**
   * In a header, bookends that don't fit beside the nav are dropped: the shirt on phones under 420px
   * and on narrow desktops (761–860px, just after the desktop links appear), and Max too on phones under 370px.
   */
  inHeader?: boolean;
};

// Each bookend is exactly capital-letter height (1cap) and sits on the baseline, so it scales with
// whatever text size the wordmark is given. Browsers without the cap unit use Georgia's cap height.
const bookend = "h-[0.69em] supports-[height:1cap]:h-[1cap] w-auto select-none";

export const PrintPetzWordmark = ({ className, darkText = true, bookends = true, inHeader = false }: Props) => (
  <span
    aria-label="PrintPetz"
    className={cn("inline-flex shrink-0 items-baseline font-[Georgia] text-4xl font-bold tracking-[-.06em]", className)}
  >
    {bookends && (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/brand/max-sitting.webp" alt="" aria-hidden width={114} height={192} className={cn(bookend, "mr-[.14em]", inHeader && "max-[370px]:hidden")} />
    )}
    <span className={darkText ? "text-[#171524]" : "text-white"}>Print</span>
    <span className="text-primary">Petz</span>
    {bookends && (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/brand/max-shirt.webp" alt="" aria-hidden width={202} height={192} className={cn(bookend, "ml-[.14em]", inHeader && "max-[420px]:hidden min-[761px]:max-[860px]:hidden")} />
    )}
  </span>
);
