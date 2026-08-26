import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, PackageCheck, Sparkles, Upload } from "lucide-react";
import { ROUTES } from "@/routes";
import shirt from "@/utils/images/mockups/t-shirt.png";
import mug from "@/utils/images/mockups/mug.png";
import pillow from "@/utils/images/mockups/pillow.png";
import astronaut from "@/utils/images/landingPage/styles/astronaut.png";
import boxer from "@/utils/images/landingPage/styles/boxing.png";
import king from "@/utils/images/landingPage/styles/king.png";

type Product = { name: string; description: string; price: string; image: StaticImageData; art: StaticImageData };

const products: Product[] = [
  { name: "Custom Pet Tee", description: "Their new alter ego on a premium everyday tee.", price: "From $34", image: shirt, art: boxer },
  { name: "Custom Pet Mug", description: "A daily dose of your favorite face.", price: "From $24", image: mug, art: king },
  { name: "Custom Pet Pillow", description: "Big personality for your favorite room.", price: "From $39", image: pillow, art: astronaut },
];

const steps = [
  { icon: Upload, label: "Upload", copy: "Add a few clear photos of your pet." },
  { icon: Sparkles, label: "Transform", copy: "Choose a look and we create the magic." },
  { icon: PackageCheck, label: "Enjoy", copy: "Approve it, download it, or put it on merch." },
];

const Wordmark = () => (
  <span className="text-2xl font-black tracking-[-.05em] text-[#171524]">
    Print<span className="text-primary">Petz</span><span className="text-[#ff6a4d]">.</span>
  </span>
);

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#e8e4f3] bg-white shadow-[0_10px_35px_rgba(43,34,79,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(78,60,155,.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f6f3ff]">
        <div className="absolute left-5 top-5 z-10 h-24 w-24 overflow-hidden rounded-[18px] border-[5px] border-white bg-white shadow-lg sm:h-28 sm:w-28">
          <Image src={product.art} alt="Pet portrait example" fill className="object-cover" />
        </div>
        <Image src={product.image} alt={product.name} fill className="object-contain object-right p-6 transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black tracking-tight text-[#171524]">{product.name}</h3>
            <p className="mt-2 min-h-11 text-sm leading-6 text-[#6d687b]">{product.description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#f0ecff] px-3 py-1.5 text-sm font-bold text-primary">{product.price}</span>
        </div>
        <Link href={ROUTES.create} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#171524] font-bold text-white transition hover:bg-primary">
          Make mine <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export const Shop = () => (
  <div className="min-h-screen overflow-hidden bg-[#fcfbff] text-[#171524]">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ebe7f4] bg-[#fcfbff]/90 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href={ROUTES.landing} aria-label="PrintPetz home"><Wordmark /></Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-[#716b80] md:flex">
          <a href="#shop" className="transition hover:text-primary">Shop</a>
          <a href="#how-it-works" className="transition hover:text-primary">How it works</a>
          <Link href={ROUTES.login} className="transition hover:text-primary">Sign in</Link>
        </nav>
        <Link href={ROUTES.create} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(111,97,239,.25)] transition hover:-translate-y-0.5 hover:bg-[#5f50e4]">
          Create my pet <ArrowRight size={16} />
        </Link>
      </div>
    </header>

    <main>
      <section className="relative px-5 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="absolute -left-40 top-40 size-80 rounded-full bg-[#ffd45e]/25 blur-[90px]" />
        <div className="absolute -right-40 top-12 size-96 rounded-full bg-[#9e8cff]/25 blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.03fr_.97fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ddd5ff] bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
              <span className="text-lg">🐾</span> Your pet has main-character energy
            </div>
            <h1 className="text-5xl font-black leading-[.96] tracking-[-.055em] sm:text-6xl md:text-7xl lg:text-[82px]">
              Your pet.<br />
              <span className="relative inline-block text-primary">
                Reimagined.
                <svg className="absolute -bottom-3 left-0 w-full text-[#ffcc4d]" viewBox="0 0 330 16" fill="none" aria-hidden="true"><path d="M3 11C75 2 208 3 327 8" stroke="currentColor" strokeWidth="7" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-[#665f75] md:text-xl lg:mx-0">
              Turn the photos you love into one-of-a-kind pet art, gifts, and game-day gear that make people smile.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href={ROUTES.create} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-black text-white shadow-[0_14px_35px_rgba(111,97,239,.3)] transition hover:-translate-y-0.5 hover:bg-[#5f50e4]">Create my PrintPetz <ArrowRight size={18} /></Link>
              <a href="#shop" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#e4dff0] bg-white px-7 font-bold transition hover:border-primary hover:text-primary">See the products <ChevronRight size={18} /></a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[#716b80] lg:justify-start">
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#22a764]" strokeWidth={3} /> Made from your photos</span>
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#22a764]" strokeWidth={3} /> Approve before ordering</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -left-8 -top-8 rotate-[-9deg] rounded-2xl bg-[#ffcc4d] px-5 py-3 text-lg font-black shadow-lg">100% good pet ✦</div>
            <div className="relative aspect-square rotate-2 overflow-hidden rounded-[40px] border-[10px] border-white bg-[#6f61ef] shadow-[0_28px_70px_rgba(55,40,116,.24)]">
              <Image src={boxer} alt="A custom PrintPetz champion portrait" fill className="object-cover" priority />
            </div>
            <div className="absolute -bottom-7 -right-4 rotate-3 rounded-2xl border border-[#e7e1f2] bg-white px-5 py-4 shadow-xl">
              <p className="text-xs font-black uppercase tracking-[.15em] text-primary">Meet</p><p className="mt-1 text-xl font-black">The Champion 🏆</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-16">
        <div className="mx-auto max-w-7xl rounded-[32px] bg-[#171524] px-6 py-10 text-white md:px-10">
          <div className="grid gap-8 md:grid-cols-[.75fr_2.25fr] md:items-center">
            <div><p className="text-sm font-black uppercase tracking-[.18em] text-[#aca2ff]">So easy</p><h2 className="mt-2 text-3xl font-black tracking-tight">Three steps.<br />One legend.</h2></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map(({ icon: Icon, label, copy }, index) => (
                <div key={label} className="rounded-[20px] bg-white/[.07] p-5">
                  <div className="mb-4 flex items-center justify-between"><div className="grid size-10 place-items-center rounded-xl bg-primary"><Icon size={19} /></div><span className="text-sm font-black text-white/25">0{index + 1}</span></div>
                  <h3 className="font-black">{label}</h3><p className="mt-2 text-sm leading-6 text-white/60">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.18em] text-primary">Pick their canvas</p>
            <h2 className="text-4xl font-black tracking-[-.04em] md:text-5xl">Art this good deserves to be seen.</h2>
            <p className="mt-4 text-lg leading-8 text-[#716b80]">Start with a portrait, then choose the perfect way to show it off.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">{products.map((product) => <ProductCard key={product.name} product={product} />)}</div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-primary px-7 py-14 text-center text-white md:px-16 md:py-20">
          <div className="absolute -left-16 -top-16 size-44 rounded-full bg-[#ffcc4d]" /><div className="absolute -bottom-28 -right-16 size-64 rounded-full border-[54px] border-white/10" />
          <div className="relative mx-auto max-w-3xl">
            <span className="text-5xl">🐶</span><h2 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">Let’s make your pet famous.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">Their masterpiece is just a few photos away.</p>
            <Link href={ROUTES.create} className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-white px-7 font-black text-[#171524] shadow-lg transition hover:-translate-y-0.5">Create my PrintPetz <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-[#ebe7f4] bg-white px-5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#777181] sm:flex-row">
        <Wordmark /><p>© 2026 PrintPetz. Your pet, reimagined.</p><div className="flex gap-6 font-semibold"><span>Privacy</span><span>Terms</span><span>Contact</span></div>
      </div>
    </footer>
  </div>
);
