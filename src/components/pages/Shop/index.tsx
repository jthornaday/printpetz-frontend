import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { ArrowUpRight } from "lucide-react";
import { PremiumHeader, PremiumFooter } from "@/components/shared/Premium";
import mug from "@/utils/images/mockups/mug.png";
import pillow from "@/utils/images/mockups/pillow.png";
const products=[{name:"The Morning Ritual",text:"Your favorite face, with your favorite coffee.",image:mug},{name:"The Cozy Companion",text:"A little more personality for your favorite corner.",image:pillow}];
export const Shop=()=> <div className="pp-site pg-site"><Head><title>The Collection | PrintPetz</title></Head><PremiumHeader/><main className="pp-wrap pp-shop"><p className="pp-eyebrow">THE PRODUCT COLLECTION</p><h1>Your favorite face.<br/><em>Your everyday favorites.</em></h1><p className="pp-intro">A look at where their artwork could go next. Create their portrait today, and imagine the possibilities.</p><div className="pp-shop-note">Merchandise preview · Physical product ordering is not yet available. Start with digital artwork in the studio.</div><div className="pp-product-grid">{products.map(p=><article key={p.name}><div className="pp-product-image"><Image src={p.image} alt={p.name + " blank product example"} fill sizes="(min-width: 800px) 380px, 90vw" className="object-contain p-8"/></div><p className="pp-eyebrow">COLLECTION PREVIEW</p><h2>{p.name}</h2><p>{p.text}</p><Link className="pp-text-link" href="/create">Create artwork for this <ArrowUpRight size={18}/></Link></article>)}</div><div className="pp-shop-end"><h2>Every great gift starts with them.</h2><Link href="/create" className="pp-button">Create my pet <ArrowUpRight size={19}/></Link></div></main><PremiumFooter/></div>;
