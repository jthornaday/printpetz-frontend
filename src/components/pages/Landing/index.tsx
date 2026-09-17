import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { ArrowRight, ArrowUpRight, Camera, Download, Sparkles } from "lucide-react";
import { PremiumHeader, PremiumFooter } from "@/components/shared/Premium";
import queen from "@/utils/images/landingPage/styles/queen.png";

const portraits = [
  { name: "The Explorer", theme: "Space", image: "/gallery/explorer.webp", alt: "Tabby cat imagined as an astronaut", detail: "To the stars and beyond." },
  { name: "The Hero", theme: "Superhero", image: "/gallery/hero.webp", alt: "White and brown terrier in a royal blue superhero cape", detail: "Everyday heroes. Extraordinary stories." },
  { name: "The Royal", theme: "Royal", image: "/gallery/royal.webp", alt: "Golden retriever in a royal blue velvet cape", detail: "Born to be iconic." },
];
const steps = [
  { title: "Introduce your pet", text: "Upload 3 or more clear photos of your best friend. Different angles help capture their distinctive features." },
  { title: "Choose their story", text: "Find a theme that brings their personality to life. Review your credit cost before you create." },
  { title: "Make it yours", text: "Create, review, refine, and download your favorites. A whole new way to celebrate them." },
];
const questions = [
  { q: "What photos should I upload?", a: "Start with at least 3 sharp photos of one pet, with their face clearly visible. Include different angles and lighting. Avoid group shots, heavy filters, and blurry images." },
  { q: "How do credits work?", a: "Your studio shows the cost before you generate. Creating a pet model currently costs 30 credits, and image generation uses 2 credits per image. You can create 1–4 images at a time. Visit Credits & plans for available purchases." },
  { q: "Can I refine my artwork?", a: "Open a finished creation to access the image editor. New creations start in Natural, with Natural, Mascot, and Cartoon options available in the editor. Download your favorites when you’re ready." },
  { q: "Can I order merchandise?", a: "Our focus today is helping you create artwork you love. The future shop will let you put your approved images on shirts, hats, coffee mugs, water bottles, sweatshirts, and more. Physical product ordering is not yet available." },
];

function StudioPreview() {
  const [selected, setSelected] = useState(0);
  const portrait = portraits[selected];
  return <div className="pg-studio-demo">
    <div className="pg-demo-top"><span>Your creative studio</span><span>Artwork examples</span></div>
    <div className="pg-demo-body">
      <div className="pg-demo-controls"><p className="pp-eyebrow">A LITTLE INSPIRATION</p><h3>Try a different story.</h3><p>Select an example to explore the possibilities.</p><div className="pg-demo-themes" role="group" aria-label="Preview artwork themes">{portraits.map((p, i) => <button key={p.theme} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}><span className="pg-demo-thumb"><Image src={p.image} alt="" fill sizes="75px" className="object-cover" /></span><span>{p.theme}</span></button>)}</div><div className="pg-demo-note"><Camera size={18}/><span>In your studio, it starts with photos of <strong>your</strong> pet.</span></div><Link href="/create" className="pp-button">Open my studio <ArrowUpRight size={16}/></Link></div>
      <figure className="pg-demo-result"><div className="pg-demo-result-image"><Image src={portrait.image} alt={portrait.alt} fill sizes="(min-width: 1000px) 380px, 80vw" className="object-cover" /></div><figcaption aria-live="polite">{portrait.name}<span>Sample character artwork</span></figcaption></figure>
    </div>
  </div>;
}

export const Landing = () => <div className="pp-site pg-site">
  <Head><title>PrintPetz | Your favorite face. A whole new story.</title><meta name="description" content="Create extraordinary pet portraits from the photos you already love. Explore imaginative themes in the PrintPetz creative studio."/></Head>
  <a className="pp-skip" href="#main-content">Skip to content</a><PremiumHeader/>
  <main id="main-content">
    <section className="pg-hero pp-wrap"><p className="pp-eyebrow">A LITTLE IMAGINATION. ALL THEIR PERSONALITY.</p><h1>Your favorite face.<br/><em>A whole new story.</em></h1><p className="pp-intro">Create extraordinary pet portraits from the photos you already love.</p><div className="pp-actions"><Link href="/create" className="pp-button">Create my pet <ArrowUpRight size={17}/></Link><a href="#collections" className="pp-text-link">See the possibilities <ArrowRight size={17}/></a></div>
      <div className="pg-triptych">{portraits.map((p,i)=><figure key={p.name} className={i===1 ? "pg-center-portrait" : ""}><div className="pg-portrait"><Image src={p.image} alt={p.alt} fill priority sizes="(min-width: 1280px) 400px, (min-width: 760px) 30vw, 45vw" className="object-cover"/></div><figcaption>{p.name}</figcaption></figure>)}</div>
      <p className="pg-example-label">A few imagined possibilities. Your story starts with your pet.</p>
    </section>
    <section className="pg-benefits pp-wrap" aria-label="Creating with PrintPetz">{[{icon:Camera,title:"Start with 3 photos",text:"Share a few clear photos of your pet."},{icon:Sparkles,title:"Explore imaginative themes",text:"From adventurous to regal. Find their story."},{icon:Download,title:"Create, refine & download",text:"Make something you’ll love to keep."}].map(({icon:Icon,title,text})=><div key={title}><span className="pg-benefit-icon"><Icon size={21}/></span><div><h2>{title}</h2><p>{text}</p></div></div>)}</section>
    <section id="collections" className="pp-section pp-wrap"><div className="pp-section-heading"><div><p className="pp-eyebrow">A WORLD OF POSSIBILITIES</p><h2>Meet their next adventure.</h2></div><Link href="/create" className="pp-text-link">Explore all themes <ArrowRight size={17}/></Link></div><div className="pp-theme-grid">{[...portraits,{name:"Her Royal Highness",theme:"Royal cat",image:queen,alt:"Cat wearing a crown and royal robes",detail:"For the one who rules your home."}].map(p=><Link href="/create" className="pp-theme" key={p.name}><div className="pp-theme-image"><Image src={p.image} alt={p.alt} fill sizes="(min-width: 1000px) 280px, 45vw" className="object-cover"/><span className="pp-image-arrow"><ArrowUpRight size={20}/></span></div><h3>{p.name}</h3><p>{p.detail}</p></Link>)}</div></section>
    <section id="how-it-works" className="pg-process"><div className="pp-wrap"><p className="pp-eyebrow">HOW IT WORKS</p><h2>From camera roll to character.</h2><div className="pg-steps">{steps.map((s,i)=><article key={s.title}><span>0{i+1}</span><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></div></section>
    <section id="studio" className="pg-studio-section"><div className="pp-wrap pg-studio-layout"><div><p className="pp-eyebrow">THE STUDIO</p><h2>A little imagination.<br/><em>All their personality.</em></h2><p className="pp-intro">The expressive eyes. The familiar face. The personality you know by heart. Give your best friend a new story in your own creative studio.</p><ul className="pg-feature-list"><li>Keep your pets and creations together</li><li>Explore a world of character themes</li><li>See your credit cost before creating</li><li>Refine and download your favorites</li></ul></div><StudioPreview/></div></section>
    <section className="pp-wrap pg-story"><div className="pg-story-art"><Image src="/gallery/hero.webp" alt="Terrier reimagined as a hero in a blue cape" fill sizes="(min-width: 800px) 440px, 90vw" className="object-cover"/></div><div><p className="pp-eyebrow">MORE THAN A PORTRAIT</p><h2>Same best friend.<br/><em>A whole new story.</em></h2><p className="pp-intro">For the pet who turns an ordinary day into your favorite day. Create a keepsake of their larger-than-life personality, or a thoughtful surprise for their favorite person.</p><Link href="/create" className="pp-text-link">Start their story <ArrowRight size={17}/></Link></div></section>
    <section className="pg-future"><div className="pp-wrap"><div><p className="pp-eyebrow">COMING LATER</p><h2>Their art. Your everyday favorites.</h2></div><p>Your approved artwork on shirts, hats, coffee mugs, water bottles, sweatshirts, and more. First, let’s create a portrait you love.</p></div></section>
    <section id="faq" className="pp-wrap pg-faq"><div><p className="pp-eyebrow">QUESTIONS</p><h2>Before their<br/>big debut.</h2></div><div>{questions.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div></section>
    <section className="pg-closing"><div className="pp-wrap"><div><p className="pp-eyebrow">ONE OF A KIND. JUST LIKE THEM.</p><h2>Ready for their<br/>next great portrait?</h2><p>A little imagination goes a long way.</p><Link href="/create" className="pp-button pp-white">Create my pet <ArrowUpRight size={17}/></Link></div><div className="pg-closing-art"><Image src="/gallery/hero.webp" alt="" fill sizes="(min-width: 760px) 440px, 90vw" className="object-cover"/></div></div></section>
  </main><PremiumFooter/>
</div>;
