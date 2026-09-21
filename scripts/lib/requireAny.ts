// Title/summary keyword gate used by requireAny feed filters.
// Short tokens use word boundaries on the *trimmed* needle so " ai " matches
// titles that start with "AI" and does not match "available" / "said".

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesGptFamily(hay: string): boolean {
  return hay.includes("chatgpt") || /\bgpt\b/.test(hay) || /\bgpt-/.test(hay) || /\bgpt\d/.test(hay);
}

function matchesLlmFamily(hay: string): boolean {
  return /\bllms?\b/.test(hay);
}

function matchesShortToken(hay: string, needle: string): boolean {
  if (needle === "ai") {
    return /\bai\b/.test(hay) || /\bai-/.test(hay) || /\ba\.i\./.test(hay);
  }
  if (needle === "ria") return /\brias?\b/.test(hay);
  if (needle === "xai") return /\bxai\b/.test(hay);
  if (needle === "gpt") return matchesGptFamily(hay);
  if (needle === "llm") return matchesLlmFamily(hay);
  try {
    return new RegExp(`\\b${escapeRegExp(needle)}\\b`, "i").test(hay);
  } catch {
    return hay.includes(needle);
  }
}

export function matchesRequireAny(
  title: string,
  summary: string | null | undefined,
  needles: string[],
): boolean {
  if (needles.length === 0) return true;
  const hay = `${title} ${summary ?? ""}`.toLowerCase();
  return needles.some((raw) => {
    const needle = raw.toLowerCase().trim();
    if (!needle) return false;
    if (needle === "chatgpt") return matchesGptFamily(hay);
    if (needle === "llms") return matchesLlmFamily(hay);
    if (needle === "security") return /\bsecurity\b/.test(hay);
    if (needle === "ria") return /\brias?\b/.test(hay);
    if (needle.length <= 3) return matchesShortToken(hay, needle);
    return hay.includes(needle);
  });
}
