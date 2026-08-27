import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  darkText?: boolean;
};

export const PrintPetzWordmark = ({ className, darkText = true }: Props) => (
  <span
    aria-label="PrintPetz"
    className={cn("inline-flex items-baseline text-4xl font-black tracking-[-.06em]", className)}
  >
    <span className={darkText ? "text-[#171524]" : "text-white"}>Print</span>
    <span className="text-primary">Petz</span>
    <span className="text-[#ff6a4d]">.</span>
  </span>
);
