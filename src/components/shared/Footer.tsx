import Link from "next/link";

import { ROUTES } from "@/routes";

export const Footer = () => (
  <div className="absolute bottom-0 px-8 py-5 flex w-full justify-between items-center">
    <div className="text-xs text-black-50">
      <p>© 2026 PrintPetz. All rights reserved.</p>
    </div>

    <div className="text-xs text-black-50 flex gap-6 font-semibold">
      <Link href={ROUTES.privacy} className="hover:text-black-50/80 transition">Privacy Policy</Link>
      <Link href={ROUTES.terms} className="hover:text-black-50/80 transition">Terms &amp; Conditions</Link>
    </div>
  </div>
);
