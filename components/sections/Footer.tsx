import Image from "next/image";
import Link from "next/link";
import { HomeLink } from "@/components/ui/HomeLink";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { footer } from "@/content/footer";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ApplyCard, QuoteCard } from "@/components/quote/QuoteCard";
import { DotMatrixMarquee } from "@/components/sections/DotMatrixMarquee";
import { ArrowRight, MailIcon, PhoneIcon } from "@/components/art/Icons";

type FooterProps = {
  /** Which finale sits above the message board: the quick-quote sign, the NOW HIRING sign, or none. */
  card?: "quote" | "apply" | "none";
  /** Copy for the quick-quote finale; each page can tell it its own way (`label` defaults to "Quick quote"). */
  quickQuote?: { label?: string; title: string; text: string; submit: string };
  marquee: string;
};

const link = "tc-link transition-colors duration-300 hover:text-white focus-visible:text-white";
const label = "font-mono text-12 uppercase tracking-[0.12em] text-white/60";
/** Text link with the site's horizontal arrow, nudging right on hover. */
const arrowLink = "group mt-16 inline-flex items-center gap-4 text-16 font-medium";
const arrow = "size-14 transition-transform duration-300 group-hover:translate-x-4 group-focus-visible:translate-x-4";

/** Dark finale over a night photo: the pitch and dispatch line on the left, the sign on the right. */
function Finale({ card, quickQuote }: { card: "quote" | "apply"; quickQuote?: FooterProps["quickQuote"] }) {
  const copy = card === "quote" && quickQuote ? { label: quickQuote.label ?? footer.finale.quote.label, title: quickQuote.title, text: quickQuote.text } : footer.finale.apply;
  return (
    <section data-header="dark" className="on-dark relative isolate overflow-hidden bg-night text-white">
      <Image src={footer.finale.image} alt="" fill sizes="100vw" className="-z-20 object-cover object-[50%_60%]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,6,8,0.9)_0%,rgba(4,6,8,0.78)_50%,rgba(4,6,8,0.62)_100%)]" />
      <Container className="py-[8.4rem] lg:py-[16rem]">
        <div className="mx-auto grid max-w-[136rem] gap-60 lg:grid-cols-[minmax(0,1fr)_minmax(0,54rem)] lg:items-center lg:gap-x-[10rem]">
          <div>
            <SectionLabel tone="dark">{copy.label}</SectionLabel>
            <Reveal as="h2" className="mt-24 text-[4.4rem] font-medium leading-[1] tracking-[-0.025em] lg:mt-30 lg:text-h2 lg:leading-[0.98]">
              {copy.title}
            </Reveal>
            <p className="mt-30 max-w-[46rem] text-18 text-white/80 lg:mt-50 lg:text-20">{copy.text}</p>
            <div className="mt-50 max-w-[46rem] border-t border-white/15 pt-24 lg:mt-[7rem]">
              <p className={label}>Or call dispatch</p>
              <a href={site.phone.href} className="mt-8 inline-block text-[3.2rem] font-medium tracking-[-0.02em] text-amber transition-colors duration-300 hover:text-amber-hi lg:text-h5">
                {site.phone.display}
              </a>
              <p className="mt-4 text-14 text-white/70">{site.hours}</p>
            </div>
          </div>
          <div>{card === "quote" && quickQuote ? <QuoteCard submit={quickQuote.submit} /> : <ApplyCard />}</div>
        </div>
      </Container>
    </section>
  );
}

/** The finale, the message-board band, and the black site footer. */
export function Footer({ card = "quote", quickQuote, marquee }: FooterProps) {
  return (
    <footer>
      {card !== "none" && <Finale card={card} quickQuote={quickQuote} />}

      <div data-header="dark" className="on-dark bg-night text-white">
        <DotMatrixMarquee text={marquee} href={site.phone.href} label={`Need a crew? Call dispatch at ${site.phone.display}`} />

        <Container className="pb-40 pt-[5.6rem] lg:pt-[11rem]">
          {/* Brand and dispatch on the left; then the sitemap, social links and the two offices. */}
          <div className="grid grid-cols-2 gap-x-20 gap-y-50 lg:grid-cols-16">
            <div className="col-span-2 lg:col-span-5">
              <HomeLink aria-label={`${site.name} home`} className="relative block h-[7.4rem] w-[15rem] lg:h-[8.6rem] lg:w-[17.4rem]">
                <Image src="/images/brand/logo-white.png" alt="" fill sizes="180px" className="object-contain object-left" />
              </HomeLink>
              <p className="mt-24 max-w-[34rem] text-16 text-white/70">{footer.tagline}</p>
              <ul className="mt-24 grid gap-8 text-16 text-white/85 lg:mt-30">
                <li>
                  <a href={site.phone.href} className="tc-link-trigger inline-flex items-center gap-12 transition-colors duration-300 hover:text-white">
                    <PhoneIcon className="size-18 shrink-0 fill-white text-ink" />
                    <span className={link}>{site.phone.display}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="tc-link-trigger inline-flex items-center gap-12 transition-colors duration-300 hover:text-white">
                    <MailIcon className="size-18 shrink-0 fill-white text-ink" />
                    <span className={link}>{site.email}</span>
                  </a>
                </li>
              </ul>
            </div>

            <nav aria-label="Footer" className="col-span-1 lg:col-span-2 lg:col-start-7">
              <p className={label}>Site</p>
              <ul className="mt-12 grid gap-8 text-16">
                <li>
                  <Link href="/" className={link}>
                    Home
                  </Link>
                </li>
                {nav.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="col-span-1 lg:col-span-2 lg:col-start-9">
              <p className={label}>Follow</p>
              <ul className="mt-12 grid gap-8 text-16">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className={link}>
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {site.offices.map((office, i) => (
              <address key={office.name} className={cn("col-span-2 not-italic sm:col-span-1 lg:col-span-3", i === 0 ? "lg:col-start-11" : "lg:col-start-14")}>
                <p className={label}>{office.name}</p>
                <p className="mt-12 text-16 text-white">
                  {office.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </p>
                <p className="mt-8 text-14 text-white/75">{site.hours}</p>
                <p className="mt-8 max-w-[26rem] text-14 text-white/60">{office.note}</p>
                <a href={office.directions} target="_blank" rel="noreferrer" className={cn(arrowLink, "mt-12 text-14 font-normal text-white", link)}>
                  Directions<span className="sr-only"> to {office.name} (opens in a new tab)</span> <ArrowRight className={arrow} />
                </a>
              </address>
            ))}
          </div>

          <div className="mt-[7rem] flex flex-col gap-12 border-t border-white/10 pt-24 font-mono text-12 uppercase tracking-[0.08em] text-white/60 lg:mt-[9rem] lg:flex-row lg:items-center lg:justify-between">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-30 gap-y-8">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
