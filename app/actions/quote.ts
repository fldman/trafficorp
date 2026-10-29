"use server";

/**
 * Quote request handler.
 *
 * Currently mocked: it validates the request and returns a ticket number but
 * does not send it anywhere. To go live, forward `data` to email (Resend),
 * a form service (Formspree) or TraffiCorp's dispatch/CRM here.
 */

export type QuoteResult =
  | { ok: true; ticket: string; name: string; receivedAt: string }
  | { ok: false; error: string };

export async function submitQuote(formData: FormData): Promise<QuoteResult> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  const name = get("name");
  const phone = get("phone");
  const email = get("email");
  const services = formData.getAll("services").map(String).filter(Boolean);

  if (!name) return { ok: false, error: "Add your name so dispatch knows who to ask for." };
  if (!phone && !email) return { ok: false, error: "Add a phone number or email so dispatch can reach you." };
  if (services.length === 0) return { ok: false, error: "Pick at least one service." };

  const plan = formData.get("plan");
  const data = {
    services,
    location: get("location"),
    roadType: get("roadType"),
    startDate: get("startDate"),
    duration: get("duration"),
    shift: get("shift"),
    name,
    company: get("company"),
    phone,
    email,
    role: get("role"),
    notes: get("notes"),
    planFile: plan instanceof File && plan.size > 0 ? { name: plan.name, size: plan.size } : null,
  };

  // Mocked delivery. Replace with a real integration before launch.
  console.info("[quote] new request", data);

  const ticket = `TC-${new Date().getFullYear().toString().slice(2)}${Math.floor(1000 + Math.random() * 9000)}`;
  return { ok: true, ticket, name: name.split(" ")[0], receivedAt: new Date().toISOString() };
}
