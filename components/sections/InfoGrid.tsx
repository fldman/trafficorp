import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { benefitIcons, type BenefitIconKey } from "@/components/art/Icons";

type Item = { title: string; text: string; icon?: BenefitIconKey };

/** Hairline grid of short points (benefits, inclusions), each led by an icon that makes one small move while its cell is hovered. */
export function InfoGrid({
  label,
  title,
  items,
  tone = "white",
}: {
  label: string;
  title: string;
  items: readonly Item[];
  tone?: "white" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      data-header={dark ? "dark" : "light"}
      className={cn(
        "relative py-[8.4rem] lg:py-[18rem]",
        dark ? "on-dark bg-asphalt text-white" : "bg-white",
      )}
    >
      <Container>
        <SectionLabel tone={dark ? "dark" : "light"}>{label}</SectionLabel>
        <Reveal
          as="h2"
          className="mt-20 max-w-[90rem] text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:text-h3 lg:leading-none"
        >
          {title}
        </Reveal>
        <ul
          className={cn(
            "mt-60 grid border-l border-t md:grid-cols-2 lg:mt-[10rem] lg:grid-cols-3",
            dark ? "border-white/20" : "border-ink/15",
          )}
        >
          {items.map((it) => {
            const Icon = it.icon ? benefitIcons[it.icon] : null;
            return (
              <li
                key={it.title}
                className={cn(
                  "group border-b border-r p-30 lg:p-40",
                  dark ? "border-white/20" : "border-ink/15",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "size-[4.8rem] lg:size-[5.6rem]",
                      dark ? "text-white" : "text-ink",
                    )}
                  />
                )}
                <h3
                  className={cn(
                    "text-[2.4rem] font-medium leading-[1.1] lg:text-28",
                    Icon ? "mt-30 lg:mt-50" : "",
                  )}
                >
                  {it.title}
                </h3>
                <p
                  className={cn(
                    "mt-12 text-16",
                    dark ? "text-white/75" : "text-body",
                  )}
                >
                  {it.text}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
