import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ImagePlus, PackageCheck, Sparkles } from "lucide-react";
import { ROUTES } from "@/routes";
import champion from "@/utils/images/sports/american-football.png";
import king from "@/utils/images/sliderImages/10.png";
import queen from "@/utils/images/sliderImages/5.png";
import explorer from "@/utils/images/sliderImages/14.png";
import coolKid from "@/utils/images/sliderImages/22.png";
import hero from "@/utils/images/sliderImages/17.png";

const styles: { name: string; image: StaticImageData; color: string }[] = [
  { name: "The Champion", image: champion, color: "bg-[#e8e2ff]" },
  { name: "The King", image: king, color: "bg-[#fff0ca]" },
  { name: "The Queen", image: queen, color: "bg-[#ffe1ea]" },
  { name: "The Explorer", image: explorer, color: "bg-[#dff4ff]" },
  { name: "The Cool Kid", image: coolKid, color: "bg-[#dcf6e8]" },
  { name: "The Hero", image: hero, color: "bg-[#e2eaff]" },
];

const Wordmark = () => (
  <span className="text-2xl font-black tracking-[-.05em] text-[#171524]">
    Print<span className="text-primary">Petz</span><span className="text-[#ff6a4d]">.</span>
  </span>
);

export const Landing = () => (
  <div className="min-h-screen overflow-hidden bg-[#fcfbff] text-[#171524]">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#ebe7f4] bg-[#fcfbff]/90 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href={ROUTES.landing} aria-label="PrintPetz home"><Wordmark /></Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-[#716b80] md:flex">
          <a href="#how-it-works" className="transition hover:text-primary">How it works</a>
          <a href="#styles" className="transition hover:text-primary">Styles</a>
          <Link href={ROUTES.shop} className="transition hover:text-primary">Shop</Link>
          <Link href={ROUTES.login} className="transition hover:text-primary">Sign in</Link>
        </nav>
        <Link href={ROUTES.create} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(111,97,239,.25)] transition hover:-translate-y-0.5 hover:bg-[#5f50e4]">
          Create my pet <ArrowRight size={16} />
        </Link>
      </div>
    </header>

    <main>
      <section className="relative px-5 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="absolute -left-36 top-20 size-96 rounded-full bg-[#ffdd79]/30 blur-[100px]" />
        <div className="absolute -right-36 top-8 size-[420px] rounded-full bg-[#a796ff]/25 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ddd5ff] bg-white px-4 py-2 text-sm font-black text-primary shadow-sm">
              <Sparkles size={16} /> Warning: extreme cuteness ahead
            </div>
            <h1 className="text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl md:text-7xl lg:text-[80px]">
              Meet the pet<br />
              <span className="text-primary">they were born</span><br />
              to become.
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-[#665f75] md:text-xl lg:mx-0">
              Upload your favorite photos. Pick a personality. Get unforgettable custom pet art made just for them.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href={ROUTES.create} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-black text-white shadow-[0_14px_35px_rgba(111,97,239,.3)] transition hover:-translate-y-0.5 hover:bg-[#5f50e4]">
                Transform my pet <ArrowRight size={18} />
              </Link>
              <a href="#styles" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#e4dff0] bg-white px-7 font-bold transition hover:border-primary hover:text-primary">
                See the magic <ChevronRight size={18} />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[#716b80] lg:justify-start">
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#22a764]" strokeWidth={3} /> No subscription required</span>
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#22a764]" strokeWidth={3} /> Download or print</span>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-[560px] grid-cols-2 gap-4">
            <div className="relative mt-12 aspect-[.82] rotate-[-3deg] overflow-hidden rounded-[34px] border-[8px] border-white bg-[#e8e2ff] shadow-[0_24px_60px_rgba(55,40,116,.18)]">
              <Image src={champion} alt="Champion pet portrait" fill className="object-cover" quality={95} sizes="(min-width: 1024px) 270px, 45vw" priority />
              <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-sm font-black shadow-lg">The Champion 🏆</span>
            </div>
            <div className="relative aspect-[.82] rotate-3 overflow-hidden rounded-[34px] border-[8px] border-white bg-[#fff0ca] shadow-[0_24px_60px_rgba(55,40,116,.18)]">
              <Image src={king} alt="Royal pet portrait" fill className="object-cover" quality={95} sizes="(min-width: 1024px) 270px, 45vw" priority />
              <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-sm font-black shadow-lg">The Royal 👑</span>
            </div>
            <div className="absolute -right-4 top-1/2 z-10 rotate-6 rounded-2xl bg-[#ffcc4d] px-5 py-3 font-black shadow-lg">So. Much. Personality.</div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece8f4] bg-white px-5 py-5">
        <div className="mx-auto grid max-w-5xl gap-3 text-center text-sm font-bold text-[#625c70] sm:grid-cols-3">
          <div className="rounded-xl bg-[#f8f6ff] px-4 py-3">✨ AI-powered pet transformations</div>
          <div className="rounded-xl bg-[#f8f6ff] px-4 py-3">🔒 Secure payments with Stripe</div>
          <div className="rounded-xl bg-[#f8f6ff] px-4 py-3">🖼️ Your creations saved to your account</div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-16">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[#171524] px-6 py-12 text-white md:px-12">
          <div className="mb-9 text-center"><p className="text-sm font-black uppercase tracking-[.18em] text-[#aca2ff]">How it works</p><h2 className="mt-2 text-3xl font-black md:text-4xl">From camera roll to wow.</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: ImagePlus, n: "01", title: "Upload photos", copy: "Choose clear photos that show off their face and personality." },
              { icon: Sparkles, n: "02", title: "Pick a look", copy: "Choose the character, mood, or game-day energy that fits them." },
              { icon: PackageCheck, n: "03", title: "Make it yours", copy: "Download the art or turn it into a gift you’ll love." },
            ].map(({ icon: Icon, n, title, copy }) => (
              <div key={n} className="rounded-[22px] bg-white/[.07] p-6">
                <div className="mb-5 flex items-center justify-between"><div className="grid size-11 place-items-center rounded-xl bg-primary"><Icon size={20} /></div><span className="text-sm font-black text-white/25">{n}</span></div>
                <h3 className="text-xl font-black">{title}</h3><p className="mt-2 leading-7 text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="styles" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.18em] text-primary">Choose their alter ego</p>
            <h2 className="text-4xl font-black tracking-[-.04em] md:text-5xl">One pet. Endless possibilities.</h2>
            <p className="mt-4 text-lg leading-8 text-[#716b80]">Go heroic, hilarious, regal, sporty—or try them all.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {styles.map((style, index) => (
              <Link href={ROUTES.create} key={style.name} className={`group relative aspect-[.82] overflow-hidden rounded-[24px] ${style.color} ${index % 2 ? "md:mt-8" : ""}`}>
                <Image src={style.image} alt={style.name} fill className="object-cover transition duration-500 group-hover:scale-105" quality={95} sizes="(min-width: 1024px) 190px, (min-width: 768px) 33vw, 50vw" />
                <span className="absolute inset-x-3 bottom-3 rounded-xl bg-white/90 px-3 py-2 text-center text-sm font-black shadow-sm backdrop-blur">{style.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href={ROUTES.create} className="inline-flex h-13 items-center gap-2 rounded-xl bg-[#171524] px-7 font-black text-white transition hover:bg-primary">Explore all styles <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="border-y border-[#ece8f4] bg-white px-5 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div><p className="text-sm font-black uppercase tracking-[.18em] text-primary">Take it off the screen</p><h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Your pet belongs on something awesome.</h2><p className="mt-3 text-[#716b80]">Shop custom tees, mugs, pillows, digital portraits, and more.</p></div>
          <Link href={ROUTES.shop} className="inline-flex h-14 shrink-0 items-center gap-2 rounded-xl bg-primary px-7 font-black text-white shadow-[0_12px_30px_rgba(111,97,239,.25)] transition hover:-translate-y-0.5">Visit the shop <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-primary px-7 py-16 text-center text-white md:px-16 md:py-20">
          <div className="absolute -left-16 -top-16 size-44 rounded-full bg-[#ffcc4d]" /><div className="absolute -bottom-28 -right-16 size-64 rounded-full border-[54px] border-white/10" />
          <div className="relative mx-auto max-w-3xl"><span className="text-5xl">🐾</span><h2 className="mt-4 text-4xl font-black tracking-[-.04em] md:text-6xl">Their masterpiece starts here.</h2><p className="mx-auto mt-5 max-w-xl text-lg text-white/75">A few photos. A whole new personality.</p><Link href={ROUTES.create} className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-white px-7 font-black text-[#171524] shadow-lg transition hover:-translate-y-0.5">Create my PrintPetz <ArrowRight size={18} /></Link></div>
        </div>
      </section>
    </main>

    <footer className="border-t border-[#ebe7f4] bg-white px-5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#777181] sm:flex-row"><Wordmark /><p>© 2026 PrintPetz. Your pet, reimagined.</p><div className="flex gap-6 font-semibold"><span>Privacy</span><span>Terms</span><span>Contact</span></div></div>
    </footer>
  </div>
);
