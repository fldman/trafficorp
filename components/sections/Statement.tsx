import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";

type Cite = { name: string; title: string };

const text = "mx-auto mt-30 max-w-[118rem] !text-[3rem] !leading-[1.15] tracking-[-0.015em] lg:mt-50 lg:!text-[5.6rem] lg:!leading-[1.08]";

/**
 * Big centred statement that reads in word by word. With `cite` it becomes a
 * quote: curly quotes around the text, and the company logo beside the
 * speaker's name and title underneath.
 */
export function Statement({ label, statement, cite }: { label: string; statement: string; cite?: Cite }) {
  return (
    <section data-header="light" className="relative bg-white py-[8.4rem] lg:py-[20rem]">
      <Container className="text-center">
        <SectionLabel className="justify-center">{label}</SectionLabel>
        {cite ? (
          <figure>
            <blockquote>
              <RevealText className={text}>{`“${statement}”`}</RevealText>
            </blockquote>
            <figcaption className="mt-40 flex items-center justify-center gap-16 lg:mt-60 lg:gap-30">
              <span className="relative block aspect-[500/248] w-[10.4rem] shrink-0 lg:w-[15rem]">
                <Image src="/images/brand/logo-dark.png" alt="TraffiCorp" fill sizes="150px" className="object-contain" />
              </span>
              <span aria-hidden className="h-[5.2rem] w-px shrink-0 bg-ink/15 lg:h-[6.4rem]" />
              <span className="flex flex-col items-start gap-6 text-left">
                <span className="text-18 font-medium leading-[1.2] text-ink">{cite.name}</span>
                <span className="font-mono text-13 uppercase tracking-[0.08em] text-label">{cite.title}</span>
              </span>
            </figcaption>
          </figure>
        ) : (
          <RevealText className={text}>{statement}</RevealText>
        )}
      </Container>
    </section>
  );
}
