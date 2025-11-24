"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function TimePicker({
  value,
  onChange,
  className,
}: {
  value?: { hh: number; mm: number; period: "AM" | "PM" };
  onChange?: (val: { hh: number; mm: number; period: "AM" | "PM" }) => void;
  className?: string;
}) {
  const [hh, setHh] = useState(value?.hh ?? 12);
  const [mm, setMm] = useState(value?.mm ?? 0);
  const [period, setPeriod] = useState<"AM" | "PM">(value?.period ?? "AM");

  const clamp = (num: number, min: number, max: number) => Math.max(min, Math.min(max, num));

  const handleUpdate = (newVal: Partial<{ hh: number; mm: number; period: "AM" | "PM" }>) => {
    const newState = {
      hh,
      mm,
      period,
      ...newVal,
    };
    setHh(newState.hh);
    setMm(newState.mm);
    setPeriod(newState.period);
    onChange?.(newState);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Hours */}
      <Input
        type="number"
        value={hh}
        min={1}
        max={12}
        onChange={(e) => handleUpdate({ hh: clamp(parseInt(e.target.value) || 1, 1, 12) })}
        className="w-16 text-center"
      />

      <span className="text-lg">:</span>

      {/* Minutes */}
      <Input
        type="number"
        value={mm.toString().padStart(2, "0")}
        min={0}
        max={59}
        onChange={(e) => handleUpdate({ mm: clamp(parseInt(e.target.value) || 0, 0, 59) })}
        className="w-16 text-center"
      />

      {/* AM/PM Toggle */}
      <Button
        type="button"
        variant="outline"
        className="w-16"
        onClick={() => handleUpdate({ period: period === "AM" ? "PM" : "AM" })}
      >
        {period}
      </Button>
    </div>
  );
}
