import Head from "next/head";
import Link from "next/link";

import { PremiumFooter, PremiumHeader } from "@/components/shared/Premium";
import { ROUTES } from "@/routes";

/**
 * Terms, Privacy, Refunds and Contact. Plain-language drafts written for launch (2026-10-01) from
 * Jake's decisions: support email, and the reprint-or-refund promise. Not legal advice; have them
 * reviewed. When a promise here changes, change the Shopify store policies to match.
 */
// To move to support@printpetz.com once that mailbox forwards correctly, set NEXT_PUBLIC_SUPPORT_EMAIL in
// Amplify and redeploy. The backend has its own matching setting, SUPPORT_EMAIL, for email reply-to.
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "myprintpetz@gmail.com";
const UPDATED = "October 1, 2026";

const Mail = () => <a href={`mailto:${SUPPORT_EMAIL}`} className="pp-inline-link">{SUPPORT_EMAIL}</a>;

const LegalPage = ({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) => (
  <div className="pp-site pg-site">
    <Head><title>{`${title} | PrintPetz`}</title></Head>
    <PremiumHeader />
    <main className="pp-wrap pp-legal">
      <p className="pp-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="pp-legal-updated">Last updated {UPDATED}</p>
      {children}
    </main>
    <PremiumFooter />
  </div>
);

export const RefundsPage = () => (
  <LegalPage title="Refunds & reprints" eyebrow="OUR PROMISE">
    <p>Every product is printed to order with your pet’s artwork, so we want it to arrive right.</p>
    <h2>If your order arrives damaged or wrong</h2>
    <p>
      Email us at <Mail /> within 30 days of delivery. Include your order number and a photo that
      clearly shows the damage or the problem. Once we’ve seen it, you choose:
    </p>
    <ul>
      <li><strong>A free reprint</strong>, sent to you at no cost, or</li>
      <li><strong>A full refund</strong> for that order.</li>
    </ul>
    <h2>Changed your mind?</h2>
    <p>
      Because each item is made just for you, we can’t take back products that arrive as ordered.
      Please check your preview before you buy; the shop shows exactly what we print.
    </p>
    <h2>Credits</h2>
    <p>
      If a portrait fails to generate, the credits for it are returned to your account
      automatically. For anything else about a credit purchase, email <Mail />.
    </p>
  </LegalPage>
);

export const ContactPage = () => (
  <LegalPage title="Contact us" eyebrow="SUPPORT">
    <p>Questions, a problem with an order, or anything else: email <Mail />.</p>
    <p>For an order, include your order number. If something arrived damaged or wrong, add a photo of it. See <Link href={ROUTES.refunds} className="pp-inline-link">Refunds &amp; reprints</Link>.</p>
  </LegalPage>
);

export const TermsPage = () => (
  <LegalPage title="Terms of Service" eyebrow="THE FINE PRINT">
    <p>
      PrintPetz turns photos of your pet into artwork and prints it on products. PrintPetz is run
      from California, USA. By creating an account or placing an order you agree to these terms.
      Contact: <Mail />.
    </p>
    <h2>Your account</h2>
    <p>
      You must be at least 18, or use PrintPetz with a parent or guardian’s permission. Keep your
      login private; you’re responsible for activity on your account.
    </p>
    <h2>Your photos</h2>
    <p>
      Only upload photos you took or have permission to use. You keep ownership of your photos. You
      give us permission to store them, process them (including sending them to the AI services
      that create your artwork) and print them, only so we can provide PrintPetz to you.
    </p>
    <p>Don’t upload anything illegal, hateful, or that infringes someone else’s rights.</p>
    <h2>Your artwork</h2>
    <p>
      Your portraits are made by AI from your photos, so results vary and may not be perfect. You
      can download and print the artwork you create for your own personal use.
    </p>
    <h2>Credits</h2>
    <p>
      Credits are used to set up a pet and to create portraits. Credits for a portrait that fails to
      generate are returned automatically. Credits have no cash value.
    </p>
    <h2>Products</h2>
    <p>
      Products are made to order by our printing partner and shipped to the address you give at
      checkout. Shop previews show exactly what we print; colours on screen can differ slightly from
      print. Damaged or wrong orders are covered by our{" "}
      <Link href={ROUTES.refunds} className="pp-inline-link">refunds &amp; reprints promise</Link>.
    </p>
    <h2>Limits</h2>
    <p>
      PrintPetz is provided as is. To the extent the law allows, we aren’t liable for indirect or
      consequential losses, and our total liability for any claim is limited to what you paid us in
      the 12 months before it.
    </p>
    <h2>Changes</h2>
    <p>
      We may update these terms. If we make a significant change we’ll update the date above, and
      continuing to use PrintPetz means you accept the new terms. California law applies.
    </p>
  </LegalPage>
);

export const PrivacyPage = () => (
  <LegalPage title="Privacy Policy" eyebrow="YOUR DATA">
    <p>This explains what PrintPetz collects, why, and who helps us run the service. Contact: <Mail />.</p>
    <h2>What we collect</h2>
    <ul>
      <li><strong>Account:</strong> your email address and login details. If you sign in with Google, we receive your name and email from Google.</li>
      <li><strong>Your pet:</strong> the photos you upload, your pet’s name and any description you add, and the artwork we create.</li>
      <li><strong>Purchases:</strong> what you bought and when. Card details are handled by our payment providers; we never see or store your card number.</li>
      <li><strong>Orders:</strong> the shipping name and address you give at checkout, used to make and deliver your order.</li>
      <li><strong>Technical:</strong> basic logs (like errors and timestamps) that keep the service working.</li>
    </ul>
    <h2>Who helps us run PrintPetz</h2>
    <p>We share data with these services only as needed to provide PrintPetz:</p>
    <ul>
      <li><strong>Supabase</strong>: accounts and database</li>
      <li><strong>Amazon Web Services</strong>: storing photos and artwork, and running our servers</li>
      <li><strong>OpenAI</strong> and <strong>fal.ai</strong>: creating your artwork (your pet photos are sent to them for this)</li>
      <li><strong>Stripe</strong>: payments for credits</li>
      <li><strong>Shopify</strong>: shop checkout</li>
      <li><strong>Printful</strong>: printing and shipping your order (they receive the print file and your shipping address)</li>
      <li><strong>Resend</strong>: sending account emails</li>
      <li><strong>Google</strong>: sign-in, if you choose it</li>
    </ul>
    <p>We don’t sell your personal information, and we don’t use advertising trackers.</p>
    <h2>Your choices</h2>
    <p>
      You can ask us for a copy of your data or ask us to delete your account, photos and artwork by
      emailing <Mail />. California residents have these rights under state law.
    </p>
    <h2>Children</h2>
    <p>PrintPetz isn’t meant for children under 13, and we don’t knowingly collect their information.</p>
    <h2>Changes</h2>
    <p>If we change this policy we’ll update the date above.</p>
  </LegalPage>
);
