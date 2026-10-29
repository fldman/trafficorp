/** Options for the "Build your work zone" quote form (modal and quick-quote card). */

export const services = [
  "Flagging",
  "Lane / road closure",
  "Pilot car",
  "AFAD",
  "Temporary signal",
  "Message board",
  "Full setup",
  "Traffic control plan",
  "Signs",
  "Equipment rental",
] as const;

export const roadTypes = ["2-lane rural", "Multilane", "Intersection", "Highway"] as const;
export const durations = ["1 day", "2–5 days", "1–4 weeks", "Full season"] as const;
export const shifts = ["Day", "Night"] as const;
export const roles = ["Contractor", "Utility", "Agency"] as const;

export type QuoteDraft = {
  services: string[];
  location: string;
  roadType: string;
  startDate: string;
  duration: string;
  shift: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  role: string;
  notes: string;
};

export const emptyDraft: QuoteDraft = {
  services: [],
  location: "",
  roadType: "",
  startDate: "",
  duration: "",
  shift: "Day",
  name: "",
  company: "",
  phone: "",
  email: "",
  role: "",
  notes: "",
};

export const steps = [
  { key: "what", label: "What", title: "What do you need on site?" },
  { key: "where", label: "Where & when", title: "Where and when is the job?" },
  { key: "who", label: "Who", title: "Who should dispatch call?" },
] as const;
