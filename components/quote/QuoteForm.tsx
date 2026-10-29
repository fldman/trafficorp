"use client";

import { useRef, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { submitQuote, type QuoteResult } from "@/app/actions/quote";
import {
  durations,
  emptyDraft,
  roadTypes,
  roles,
  services,
  shifts,
  steps,
  type QuoteDraft,
} from "@/content/quote";
import { Button } from "@/components/ui/Button";

export const lightField =
  "h-56 w-full border border-ink/15 bg-white px-20 text-16 text-ink placeholder:text-label transition-colors duration-300 hover:border-ink/30 focus:border-ink focus:outline-none";

type ChipGroupProps = {
  name: string;
  legend: string;
  options: readonly string[];
  type: "checkbox" | "radio";
  value: string | string[];
  onChange: (v: string) => void;
};

/** Chip-styled checkboxes or radios (real inputs, so keyboard and screen readers work). */
function ChipGroup({ name, legend, options, type, value, onChange }: ChipGroupProps) {
  const isOn = (o: string) => (Array.isArray(value) ? value.includes(o) : value === o);
  return (
    <fieldset>
      <legend className="text-14 text-body">{legend}</legend>
      <div className="mt-12 flex flex-wrap gap-8">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type={type} name={name} value={o} checked={isOn(o)} onChange={() => onChange(o)} className="peer sr-only" />
            <span
              className={cn(
                "inline-flex h-44 items-center border px-18 text-16 transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink lg:h-48",
                isOn(o) ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink hover:border-ink/40",
              )}
            >
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-14 text-body">
        {label}
        {hint && <span className="text-label"> · {hint}</span>}
      </span>
      <span className="mt-8 block">{children}</span>
    </label>
  );
}

/** The live "work order" that builds up as the form is filled in. */
export function WorkOrder({ draft, ticket }: { draft: QuoteDraft; ticket?: string }) {
  const rows: Array<[string, string]> = [
    ["Services", draft.services.join(", ")],
    ["Location", draft.location],
    ["Road", draft.roadType],
    ["Start", draft.startDate ? new Date(`${draft.startDate}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""],
    ["Duration", draft.duration],
    ["Shift", draft.shift],
    ["Contact", [draft.name, draft.company].filter(Boolean).join(" · ")],
  ];
  return (
    <div className="relative bg-white font-mono text-ink">
      <div className="flex items-center justify-between border-b border-dashed border-ink/20 px-20 py-16 text-12 tracking-[0.06em] lg:px-24">
        <span>WORK ORDER</span>
        <span className={ticket ? "bg-amber px-6 text-ink" : "text-label"}>{ticket ?? "DRAFT"}</span>
      </div>
      <dl className="px-20 py-12 text-12 lg:px-24">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-16 border-b border-ink/5 py-8 last:border-0">
            <dt className="w-[8rem] shrink-0 text-label uppercase">{k}</dt>
            <dd className={cn("min-w-0 break-words", !v && "text-mute")}>{v || "—"}</dd>
          </div>
        ))}
      </dl>
      {/* Perforated tear line */}
      <div aria-hidden className="h-8 bg-[radial-gradient(circle,transparent_0.35rem,#fff_0.4rem)] bg-[length:1.4rem_1.4rem] bg-[position:0.7rem_0.7rem]" />
    </div>
  );
}

type QuoteFormProps = {
  initial?: Partial<QuoteDraft>;
  initialStep?: number;
  onDraftChange?: (d: QuoteDraft) => void;
  onSubmitted?: (r: Extract<QuoteResult, { ok: true }>) => void;
  /** Show the work order inside the form: always, or only below desktop (where the side panel is hidden). */
  inlineSummary?: boolean | "mobile";
};

/** Three-step "Build your work zone" form. Used in the modal and on /quote. */
export function QuoteForm({ initial, initialStep = 0, onDraftChange, onSubmitted, inlineSummary }: QuoteFormProps) {
  const [draft, setDraft] = useState<QuoteDraft>({ ...emptyDraft, ...initial });
  const [step, setStep] = useState(initialStep);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<QuoteResult, { ok: true }> | null>(null);
  const [pending, startTransition] = useTransition();
  const file = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<QuoteDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    onDraftChange?.(next);
    setError(null);
  };
  const toggleService = (s: string) =>
    update({ services: draft.services.includes(s) ? draft.services.filter((x) => x !== s) : [...draft.services, s] });

  const validate = (i: number) => {
    if (i === 0 && draft.services.length === 0) return "Pick at least one service.";
    if (i === 1 && !draft.location) return "Add a city or ZIP so dispatch knows where.";
    if (i === 2 && !draft.name) return "Add your name so dispatch knows who to ask for.";
    if (i === 2 && !draft.phone && !draft.email) return "Add a phone number or email.";
    return null;
  };

  const next = () => {
    const e = validate(step);
    if (e) return setError(e);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const submit = () => {
    const e = validate(0) ?? validate(1) ?? validate(2);
    if (e) return setError(e);
    const fd = new FormData();
    Object.entries(draft).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
      else fd.append(k, v);
    });
    const f = file.current?.files?.[0];
    if (f) fd.append("plan", f);
    startTransition(async () => {
      const r = await submitQuote(fd);
      if (!r.ok) return setError(r.error);
      setResult(r);
      onSubmitted?.(r);
    });
  };

  if (result) return <Ticket result={result} draft={draft} />;

  const current = steps[step];
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < steps.length - 1) next();
        else submit();
      }}
      className="flex h-full flex-col"
    >
      {/* Step indicator: The Line fills up to the current step */}
      <ol className="grid grid-cols-3 gap-8 font-mono text-12 tracking-[0.04em]">
        {steps.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              aria-current={i === step ? "step" : undefined}
              className={cn("block w-full text-left", i <= step ? "text-ink" : "text-label")}
            >
              0{i + 1} · {s.label.toUpperCase()}
              <span className="mt-10 block h-2 bg-[repeating-linear-gradient(90deg,#d4d4d4_0_1.2rem,transparent_1.2rem_1.8rem)]">
                <span className={cn("block h-full bg-amber transition-[width] duration-700 ease-out-expo", i <= step ? "w-full" : "w-0")} />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <h3 className="mt-40 text-[3rem] leading-[1.05] font-medium tracking-[-0.01em] lg:mt-50 lg:text-h5">{current.title}</h3>

      <div className="mt-30 grid gap-30">
        {step === 0 && (
          <ChipGroup name="services" legend="Pick everything you need. You can change it later." type="checkbox" options={services} value={draft.services} onChange={toggleService} />
        )}

        {step === 1 && (
          <>
            <Field label="City or ZIP">
              <input className={lightField} value={draft.location} onChange={(e) => update({ location: e.target.value })} placeholder="e.g. Spokane or 83814" autoComplete="postal-code" />
            </Field>
            <ChipGroup name="roadType" legend="Road type" type="radio" options={roadTypes} value={draft.roadType} onChange={(v) => update({ roadType: v })} />
            <div className="grid gap-20 md:grid-cols-2">
              <Field label="Start date">
                <input type="date" className={lightField} value={draft.startDate} onChange={(e) => update({ startDate: e.target.value })} />
              </Field>
              <ChipGroup name="shift" legend="Shift" type="radio" options={shifts} value={draft.shift} onChange={(v) => update({ shift: v })} />
            </div>
            <ChipGroup name="duration" legend="How long?" type="radio" options={durations} value={draft.duration} onChange={(v) => update({ duration: v })} />
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-20 md:grid-cols-2">
              <Field label="Name">
                <input className={lightField} value={draft.name} onChange={(e) => update({ name: e.target.value })} autoComplete="name" />
              </Field>
              <Field label="Company" hint="optional">
                <input className={lightField} value={draft.company} onChange={(e) => update({ company: e.target.value })} autoComplete="organization" />
              </Field>
              <Field label="Phone">
                <input type="tel" className={lightField} value={draft.phone} onChange={(e) => update({ phone: e.target.value })} autoComplete="tel" />
              </Field>
              <Field label="Email">
                <input type="email" className={lightField} value={draft.email} onChange={(e) => update({ email: e.target.value })} autoComplete="email" />
              </Field>
            </div>
            <ChipGroup name="role" legend="You are a…" type="radio" options={roles} value={draft.role} onChange={(v) => update({ role: v })} />
            <Field label="Anything dispatch should know?" hint="optional">
              <textarea rows={3} className={cn(lightField, "h-auto py-16")} value={draft.notes} onChange={(e) => update({ notes: e.target.value })} />
            </Field>
            <Field label="Traffic control plan or drawings" hint="optional, PDF or image">
              <input
                ref={file}
                type="file"
                accept=".pdf,image/*"
                className="block w-full text-14 text-body file:mr-16 file:h-44 file:cursor-pointer file:border-0 file:bg-paper file:px-18 file:text-14 file:text-ink hover:file:bg-concrete"
              />
            </Field>
          </>
        )}
      </div>

      {inlineSummary && (
        <div className={cn("mt-40", inlineSummary === "mobile" && "lg:hidden")}>
          <WorkOrder draft={draft} />
        </div>
      )}

      <p role="alert" aria-live="polite" className={cn("mt-20 flex min-h-[2.2rem] items-center gap-8 text-14 font-medium text-danger", !error && "invisible")}>
        {error && <span aria-hidden>▲</span>}
        {error}
      </p>

      <div className="mt-auto flex flex-col gap-20 pt-20 md:flex-row md:items-center md:justify-between">
        <p className="text-14 text-body">
          Rather talk? Call dispatch{" "}
          <a href={site.phone.href} className="tc-link-rest text-ink">
            {site.phone.display}
          </a>
          <span className="block text-label">{site.hours}</span>
        </p>
        <div className="flex gap-8">
          {step > 0 && (
            <Button variant="light" size="lg" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button type="submit" size="lg" disabled={pending}>
            {step < steps.length - 1 ? "Next" : pending ? "Sending…" : "Send to dispatch"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/** Success state, styled like a dispatch ticket. */
function Ticket({ result, draft }: { result: Extract<QuoteResult, { ok: true }>; draft: QuoteDraft }) {
  const time = new Date(result.receivedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <div className="flex h-full flex-col" role="status" aria-live="polite">
      <p className="font-mono text-12 tracking-[0.06em] text-label">RECEIVED {time} · {result.ticket}</p>
      <h3 className="mt-30 text-[3.2rem] leading-[1.05] font-medium tracking-[-0.01em] lg:text-h4">
        Thanks, {result.name}. <span className="tc-mark">You&rsquo;re on the board.</span>
      </h3>
      <p className="mt-20 max-w-[52rem] text-18 text-body">
        Dispatch has your work order and will call you to confirm crew, devices and timing. If it&rsquo;s urgent, call{" "}
        <a href={site.phone.href} className="tc-link-rest text-ink">
          {site.phone.display}
        </a>{" "}
        and quote ticket <span className="font-mono text-ink">{result.ticket}</span>.
      </p>
      <div className="mt-40 max-w-[48rem] shadow-[0_2rem_6rem_-2rem_rgba(0,0,0,0.25)]">
        <WorkOrder draft={draft} ticket={result.ticket} />
      </div>
    </div>
  );
}
