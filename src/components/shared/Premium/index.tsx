import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PrintPetzWordmark } from "../PrintPetzWordmark";
import { shopEnabled } from "@/utils/shopMode";

export function PremiumHeader() {
  const [open, setOpen] = useState(false);
  const [shop, setShop] = useState(false);
  useEffect(() => setShop(shopEnabled()), []);
  return <header className="pp-header"><div className="pp-wrap pp-nav">
    <Link href="/" aria-label="PrintPetz home"><PrintPetzWordmark className="text-3xl" /></Link>
    <nav aria-label="Main navigation" className="pp-desktop-nav">{shop && <Link href="/shop">Shop</Link>}<Link href="/#collections">Explore themes</Link><Link href="/#how-it-works">How it works</Link><Link href="/#studio">The studio</Link></nav>
    <div className="pp-nav-actions"><Link className="pp-signin" href="/login">Sign in</Link><Link className="pp-button pp-small" href="/create">Create my pet <ArrowUpRight size={16}/></Link><button className="pp-menu" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    {open && <nav id="mobile-navigation" className="pp-mobile-nav" aria-label="Mobile navigation" onClick={() => setOpen(false)}>{shop && <Link href="/shop">Shop</Link>}<Link href="/#collections">Explore themes</Link><Link href="/#how-it-works">How it works</Link><Link href="/#studio">The studio</Link><Link href="/login">Sign in</Link></nav>}
  </div></header>;
}
export function PremiumFooter() {
  return <footer className="pp-footer pp-wrap"><div><Link href="/" aria-label="PrintPetz home"><PrintPetzWordmark className="text-3xl"/></Link><p>A little imagination. A whole lot of them.</p></div><nav aria-label="Footer navigation"><Link href="/create">Your studio</Link><Link href="/plan">Credits & plans</Link><Link href="/login">Sign in</Link></nav><span>© {new Date().getFullYear()} PrintPetz</span></footer>;
}
