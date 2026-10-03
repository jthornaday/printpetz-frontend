import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { PrintPetzWordmark } from "../PrintPetzWordmark";
import { shopEnabled } from "@/utils/shopMode";
import { useGetUser } from "@/hooks/user/useGetUser";

export function PremiumHeader() {
  const [open, setOpen] = useState(false);
  const [shop, setShop] = useState(false);
  useEffect(() => setShop(shopEnabled()), []);
  // Signed-in visitors see their studio, not "Sign in".
  const { user } = useGetUser();
  return <header className="pp-header"><div className="pp-wrap pp-nav">
    <Link href="/" aria-label="PrintPetz home"><PrintPetzWordmark className="text-3xl" /></Link>
    <nav aria-label="Main navigation" className="pp-desktop-nav">{shop && <Link href="/shop">Shop</Link>}<Link href="/#collections">Explore themes</Link><Link href="/#how-it-works">How it works</Link><Link href="/#studio">The studio</Link></nav>
    <div className="pp-nav-actions">{user ? <><Link className="pp-signin" href="/create">Your studio</Link><Link className="pp-signin" href="/history">Your gallery</Link></> : <Link className="pp-signin" href="/login">Sign in</Link>}<button className="pp-menu" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    {open && <nav id="mobile-navigation" className="pp-mobile-nav" aria-label="Mobile navigation" onClick={() => setOpen(false)}>{shop && <Link href="/shop">Shop</Link>}<Link href="/#collections">Explore themes</Link><Link href="/#how-it-works">How it works</Link><Link href="/#studio">The studio</Link>{user ? <><Link href="/create">Your studio</Link><Link href="/history">Your gallery</Link></> : <Link href="/login">Sign in</Link>}</nav>}
  </div></header>;
}
export function PremiumFooter() {
  const { user } = useGetUser();
  return <footer className="pp-footer pp-wrap"><div><Link href="/" aria-label="PrintPetz home"><PrintPetzWordmark className="text-3xl"/></Link><p>A little imagination. A whole lot of them.</p></div><nav aria-label="Footer navigation"><Link href="/create">Your studio</Link><Link href="/plan">Credits & plans</Link>{user ? <Link href="/history">Your gallery</Link> : <Link href="/login">Sign in</Link>}</nav><nav aria-label="Policies" className="pp-footer-legal"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refunds">Refunds</Link><Link href="/contact">Contact</Link></nav><span>© {new Date().getFullYear()} PrintPetz</span></footer>;
}
