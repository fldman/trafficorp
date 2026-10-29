"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, contactIcons, type ContactIconKey } from "@/components/art/Icons";
import { useQuote } from "@/components/providers/QuoteProvider";

type Channel = { icon: ContactIconKey; title: string; value: string; href: string; text: string };

const card =
  "group flex h-full w-full flex-col bg-white/[0.06] p-24 text-left ring-1 ring-inset ring-white/10 backdrop-blur-[0.6rem] transition-colors duration-500 hover:bg-amber hover:text-ink focus-visible:bg-amber focus-visible:text-ink lg:p-30";

/**
 * Dark opener for the contact page: the heading and intro, then the three ways
 * in as glass tiles, each with its icon, that turn into amber sign panels on
 * hover. "#quote" opens the quote form.
 */
export function ContactHero({ label, title, intro, image, channels }: { label: string; title: string; intro: string; image: { src: string; alt: string }; channels: readonly Channel[] }) {
  const quote = useQuote();

  const body = (c: Channel) => {
    const Icon = contactIcons[c.icon];
    return (
      <>
        <span className="flex items-start justify-between gap-12">
          <Icon className="size-[4.8rem] text-ink lg:size-[5.6rem]" />
          <ArrowRight className="size-16 shrink-0 transition-[translate] duration-500 ease-out-expo group-hover:translate-x-4 group-focus-visible:translate-x-4" />
        </span>
        <span className="mt-30 block text-18 font-medium lg:mt-40">{c.title}</span>
        <span className="mt-6 block break-words text-[2.8rem] font-medium leading-[1.1] tracking-[-0.02em]">{c.value}</span>
        <span className="mt-12 block text-14 text-white/70 transition-colors duration-500 group-hover:text-ink group-focus-visible:text-ink">{c.text}</span>
      </>
    );
  };

  return (
    <section data-header="dark" className="on-dark relative overflow-hidden bg-night text-white">
      <Container className="relative z-10 pb-[4rem] pt-[14rem] lg:pb-[14rem] lg:pt-[22rem]">
        <div className="lg:max-w-[112rem]">
          <SectionLabel tone="dark">{label}</SectionLabel>
          <Reveal as="h1" trigger="load" className="mt-24 text-[5rem] font-medium leading-[0.98] tracking-[-0.035em] lg:mt-40 lg:text-[13rem] lg:leading-[0.92]">
            {title}
          </Reveal>
          <Reveal as="p" mode="fade" trigger="load" delay={0.4} className="mt-30 max-w-[56rem] text-18 text-white/80 lg:mt-40 lg:text-20">
            {intro}
          </Reveal>

          <h2 className="sr-only">Ways to reach us</h2>
          <ul className="mt-50 grid gap-12 lg:mt-[8rem] lg:grid-cols-3 lg:gap-16">
            {channels.map((c) => (
              <li key={c.title}>
                {c.href === "#quote" ? (
                  <button type="button" onClick={() => quote.open()} className={card}>
                    {body(c)}
                  </button>
                ) : (
                  <a href={c.href} className={card}>
                    {body(c)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Desktop: the photo fills the right side behind the content. Tablets and phones: it follows the cards, rising out of the dark. */}
      <div className="relative aspect-[4/3] md:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[42%]">
        <Image src={image.src} alt={image.alt} fill preload sizes="(min-width: 1200px) 42vw, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,#040608_0%,rgba(4,6,8,0.55)_28%,rgba(4,6,8,0)_62%)] lg:bg-[linear-gradient(to_right,#040608_0%,rgba(4,6,8,0.2)_45%,rgba(4,6,8,0)_100%)]" />
      </div>
    </section>
  );
}
