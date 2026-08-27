import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleDot,
  Coffee,
  Gift,
  GlassWater,
  Heart,
  Home,
  ImagePlus,
  PackageCheck,
  Shirt,
  Sparkles,
} from "lucide-react";

import { ROUTES } from "@/routes";
import mug from "@/utils/images/mockups/mug.png";
import pillow from "@/utils/images/mockups/pillow.png";
import shirt from "@/utils/images/mockups/t-shirt.png";
import champion from "@/utils/images/sports/american-football.png";
import king from "@/utils/images/sliderImages/10.png";
import explorer from "@/utils/images/sliderImages/14.png";
import hero from "@/utils/images/sliderImages/17.png";
import coolKid from "@/utils/images/sliderImages/22.png";
import queen from "@/utils/images/sliderImages/5.png";

const styles: { name: string; image: StaticImageData; color: string }[] = [
  { name: "Game Day", image: champion, color: "bg-[#e8e2ff]" },
  { name: "Royal", image: king, color: "bg-[#fff0ca]" },
  { name: "Adventure", image: explorer, color: "bg-[#dff4ff]" },
  { name: "Cool Kid", image: coolKid, color: "bg-[#dcf6e8]" },
  { name: "Queen", image: queen, color: "bg-[#ffe1ea]" },
  { name: "Hero", image: hero, color: "bg-[#e2eaff]" },
];

const products = [
  {
    icon: Shirt,
    name: "Apparel",
    copy: "Tees, hoodies, jerseys, and more",
    color: "bg-[#eeeaff] text-primary",
  },
  {
    icon: Coffee,
    name: "Coffee cups",
    copy: "Start every morning with their face",
    color: "bg-[#fff0d2] text-[#a76500]",
  },
  {
    icon: GlassWater,
    name: "Water bottles",
    copy: "Bring your best friend everywhere",
    color: "bg-[#dff4ff] text-[#0877a8]",
  },
  {
    icon: CircleDot,
    name: "Coasters",
    copy: "Small canvas, huge personality",
    color: "bg-[#dcf6e8] text-[#168054]",
  },
  {
    icon: GlassWater,
    name: "Glassware",
    copy: "Custom glasses made unmistakably yours",
    color: "bg-[#ffe7ed] text-[#b33b5d]",
  },
  {
    icon: Home,
    name: "Home & gifts",
    copy: "Pillows, keepsakes, and giftable favorites",
    color: "bg-[#f0e8ff] text-[#7950b6]",
  },
];

const steps = [
  {
    icon: ImagePlus,
    title: "Upload their photos",
    copy: "Start with 3 clear photos. Add more angles for an even closer likeness.",
  },
  {
    icon: Sparkles,
    title: "Choose their look",
    copy: "Turn your pet into a champion, explorer, royal, hero, and more.",
  },
  {
    icon: BadgeCheck,
    title: "Approve the artwork",
    copy: "Choose the creation that feels most like your pet before moving forward.",
  },
  {
    icon: PackageCheck,
    title: "Put it on products",
    copy: "Use the approved design on apparel, drinkware, gifts, or a digital portrait.",
  },
];

const Wordmark = () => (
  <span className="text-2xl font-black tracking-[-.05em] text-[#171524]">
    Print<span className="text-primary">Petz</span>
    <span className="text-[#ff6a4d]">.</span>
  </span>
);

const ProductMockup = ({
  image,
  label,
  className,
}: {
  image: StaticImageData;
  label: string;
  className: string;
}) => (
  <div
    className={`absolute z-20 flex w-32 flex-col items-center rounded-[22px] border-[6px] border-white bg-white px-3 pb-3 pt-2 shadow-[0_18px_45px_rgba(43,34,79,.2)] ${className}`}
  >
    <div className="relative h-24 w-full">
      <Image src={image} alt={label} fill className="object-contain" quality={100} sizes="128px" />
    </div>
    <span className="text-xs font-black text-[#171524]">{label}</span>
  </div>
);

export const Landing = () => (
  <div className="min-h-screen overflow-hidden bg-[#fcfbff] text-[#171524]">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ebe7f4] bg-[#fcfbff]/90 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href={ROUTES.landing} aria-label="PrintPetz home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-[#716b80] md:flex">
          <a href="#products" className="transition hover:text-primary">
            Products
          </a>
          <a href="#how-it-works" className="transition hover:text-primary">
            How it works
          </a>
          <a href="#styles" className="transition hover:text-primary">
            Styles
          </a>
          <Link href={ROUTES.shop} className="transition hover:text-primary">
            Shop
          </Link>
          <Link href={ROUTES.login} className="transition hover:text-primary">
            Sign in
          </Link>
        </nav>
        <Link
          href={ROUTES.create}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(111,97,239,.25)] transition hover:-translate-y-0.5 hover:bg-[#5f50e4]"
        >
          Create my pet <ArrowRight size={16} />
        </Link>
      </div>
    </header>

    <main>
      <section className="relative px-5 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="absolute -left-36 top-20 size-96 rounded-full bg-[#ffdd79]/30 blur-[100px]" />
        <div className="absolute -right-36 top-8 size-[420px] rounded-full bg-[#a796ff]/25 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_.98fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ddd5ff] bg-white px-4 py-2 text-sm font-black text-primary shadow-sm">
              <Sparkles size={16} /> Personalized pet products, powered by AI
            </div>
            <h1 className="text-5xl font-black leading-[.94] tracking-[-.055em] sm:text-6xl md:text-7xl lg:text-[78px]">
              Your pet.
              <br />
              <span className="text-primary">On products</span>
              <br />
              you&apos;ll love.
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#665f75] md:text-xl lg:mx-0">
              Turn your pet&apos;s photos into one-of-a-kind character art—then put the design you
              approve on apparel, drinkware, gifts, and more.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={ROUTES.create}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-black text-white shadow-[0_14px_35px_rgba(111,97,239,.3)] transition hover:-translate-y-0.5 hover:bg-[#5f50e4]"
              >
                Create my pet <ArrowRight size={18} />
              </Link>
              <Link
                href={ROUTES.shop}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#e4dff0] bg-white px-7 font-bold transition hover:border-primary hover:text-primary"
              >
                Shop products <ChevronRight size={18} />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[#716b80] lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#22a764]" strokeWidth={3} /> Approve the artwork
                first
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#22a764]" strokeWidth={3} /> Reuse it across
                products
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[570px] pb-20 pt-4 sm:px-14">
            <div className="relative mx-auto aspect-[.88] max-w-[410px] rotate-2 overflow-hidden rounded-[38px] border-[9px] border-white bg-[#e8e2ff] shadow-[0_28px_70px_rgba(55,40,116,.22)]">
              <Image
                src={champion}
                alt="Custom PrintPetz character ready for personalized products"
                fill
                className="object-cover"
                quality={95}
                sizes="(min-width: 1024px) 410px, 76vw"
                priority
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[.16em] text-primary">
                  Approved artwork
                </p>
                <p className="mt-1 text-xl font-black">Ready for their merch ✦</p>
              </div>
            </div>
            <ProductMockup
              image={shirt}
              label="Apparel"
              className="-left-1 bottom-3 -rotate-6 sm:left-0"
            />
            <ProductMockup
              image={mug}
              label="Drinkware"
              className="-right-1 top-3 rotate-6 sm:right-0"
            />
            <ProductMockup
              image={pillow}
              label="Home & gifts"
              className="bottom-0 right-7 rotate-3 sm:right-4"
            />
            <div className="absolute left-0 top-0 z-20 -rotate-6 rounded-2xl bg-[#ffcc4d] px-5 py-3 font-black shadow-lg">
              One pet. So many possibilities.
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece8f4] bg-white px-5 py-5">
        <div className="mx-auto grid max-w-5xl gap-3 text-center text-sm font-bold text-[#625c70] sm:grid-cols-3">
          <div className="rounded-xl bg-[#f8f6ff] px-4 py-3">
            🐾 Made from your pet&apos;s photos
          </div>
          <div className="rounded-xl bg-[#f8f6ff] px-4 py-3">✓ You choose the final artwork</div>
          <div className="rounded-xl bg-[#f8f6ff] px-4 py-3">🎁 Made for keeping or gifting</div>
        </div>
      </section>

      <section id="products" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.18em] text-primary">
              Made for more than the screen
            </p>
            <h2 className="text-4xl font-black tracking-[-.04em] md:text-5xl">
              Put your favorite face on your favorite things.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#716b80]">
              Create the artwork once, then choose how you want to enjoy it.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(({ icon: Icon, name, copy, color }) => (
              <Link
                href={ROUTES.shop}
                key={name}
                className="group flex items-center gap-5 rounded-[24px] border border-[#e8e4f3] bg-white p-5 shadow-[0_8px_28px_rgba(43,34,79,.05)] transition hover:-translate-y-1 hover:border-[#d5ccff] hover:shadow-[0_16px_40px_rgba(78,60,155,.12)]"
              >
                <div className={`grid size-14 shrink-0 place-items-center rounded-2xl ${color}`}>
                  <Icon size={25} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black">{name}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#716b80]">{copy}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-[#c3bdce] transition group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={ROUTES.shop}
              className="inline-flex h-13 items-center gap-2 rounded-xl bg-[#171524] px-7 font-black text-white transition hover:bg-primary"
            >
              Explore the shop <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-16">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[#171524] px-6 py-12 text-white md:px-12 md:py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[.18em] text-[#aca2ff]">
              From photos to products
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
              Your pet becomes the star.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, copy }, index) => (
              <div key={title} className="rounded-[22px] bg-white/[.07] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-xl bg-primary">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-black text-white/25">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="styles" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.18em] text-primary">
              Choose their alter ego
            </p>
            <h2 className="text-4xl font-black tracking-[-.04em] md:text-5xl">
              The artwork starts with their personality.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#716b80]">
              Sporty, regal, heroic, adventurous—or something completely their own.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {styles.map((style, index) => (
              <Link
                href={ROUTES.create}
                key={style.name}
                className={`group relative aspect-[.82] overflow-hidden rounded-[24px] ${style.color} ${index % 2 ? "md:mt-8" : ""}`}
              >
                <Image
                  src={style.image}
                  alt={`${style.name} custom pet artwork`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  quality={95}
                  sizes="(min-width: 1024px) 190px, (min-width: 768px) 33vw, 50vw"
                />
                <span className="absolute inset-x-3 bottom-3 rounded-xl bg-white/90 px-3 py-2 text-center text-sm font-black shadow-sm backdrop-blur">
                  {style.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={ROUTES.create}
              className="inline-flex h-13 items-center gap-2 rounded-xl bg-[#171524] px-7 font-black text-white transition hover:bg-primary"
            >
              Create their look <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece8f4] bg-white px-5 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[.85fr_1.15fr]">
          <div className="mx-auto grid size-64 place-items-center rounded-full bg-[#f0ecff] text-primary sm:size-72">
            <div className="grid size-48 place-items-center rounded-full border-2 border-dashed border-primary/30 bg-white shadow-[0_18px_50px_rgba(78,60,155,.12)] sm:size-56">
              <Gift size={78} strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-black uppercase tracking-[.18em] text-primary">
              A gift that could only be theirs
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-.04em] md:text-5xl">
              Funny. Meaningful. Completely one of a kind.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#716b80]">
              Celebrate a birthday, holiday, game day, new pet, or treasured memory with something
              made around the pet they love most.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold text-[#625c70] md:justify-start">
              {["Pet parents", "Birthdays", "Holidays", "Game days", "Keepsakes"].map(
                (occasion) => (
                  <span key={occasion} className="rounded-full bg-[#f6f3ff] px-4 py-2">
                    {occasion}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-primary px-7 py-16 text-center text-white md:px-16 md:py-20">
          <div className="absolute -left-16 -top-16 size-44 rounded-full bg-[#ffcc4d]" />
          <div className="absolute -bottom-28 -right-16 size-64 rounded-full border-[54px] border-white/10" />
          <div className="relative mx-auto max-w-3xl">
            <Heart className="mx-auto" size={48} fill="currentColor" />
            <h2 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">
              Your pet is one of a kind. Their gear should be too.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
              Start with their photos. Finish with something you&apos;ll be proud to wear, use,
              display, or give.
            </p>
            <Link
              href={ROUTES.create}
              className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-white px-7 font-black text-[#171524] shadow-lg transition hover:-translate-y-0.5"
            >
              Create my PrintPetz <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-[#ebe7f4] bg-white px-5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#777181] sm:flex-row">
        <Wordmark />
        <p>© 2026 PrintPetz. Your pet, made personal.</p>
        <div className="flex gap-6 font-semibold">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  </div>
);
