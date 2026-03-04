"use client";

import { useState } from "react";
import { WormMascot, type WormVariant } from "../components/WormMascot";

const VARIANTS: WormVariant[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function BlogMascot() {
  const [variant, setVariant] = useState<WormVariant>(2);

  const cycleVariant = () => {
    setVariant((v) => {
      const i = VARIANTS.indexOf(v);
      return VARIANTS[(i + 1) % VARIANTS.length];
    });
  };

  return (
    <button
      type="button"
      onClick={cycleVariant}
      className="cursor-pointer rounded-full p-2 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--muted-fg)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
      aria-label="Tap to change mascot color"
      title="Tap to change color"
    >
      <WormMascot variant={variant} className="opacity-60" />
    </button>
  );
}
