import { useEffect, useState } from "react";

/**
 * Real-time "open now" detection for a mechanic, derived from its stored
 * `hours` schedule ({ day, time }) rather than the static `isOpen` flag.
 *
 * The schedule is free-form and bilingual, so the parser is deliberately
 * forgiving. It understands:
 *   - English + Georgian day names and common abbreviations
 *   - day ranges ("Mon–Fri", "Monday to Friday", "ორშ-პარ")
 *   - day lists ("Mon, Wed, Fri")
 *   - "everyday" / "weekdays" / "weekend" keywords
 *   - time ranges ("09:00 – 18:00"), overnight ranges ("22:00 – 04:00"),
 *     "Closed" / "დაკეტილია", and "24/7"
 *
 * When the schedule can't be understood at all, it returns `known: false` so
 * callers can fall back to the manually-set `isOpen` flag.
 */

// JS getDay() convention: 0 = Sunday … 6 = Saturday.
const DAY_TOKENS = {
  // English
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
  // Georgian (full + short forms)
  კვირა: 0,
  ორშაბათი: 1, ორშ: 1,
  სამშაბათი: 2, სამშ: 2,
  ოთხშაბათი: 3, ოთხშ: 3,
  ხუთშაბათი: 4, ხუთშ: 4,
  პარასკევი: 5, პარ: 5,
  შაბათი: 6, შაბ: 6,
};

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

function normToken(t) {
  return String(t || "").trim().toLowerCase().replace(/\.+$/, "");
}

/** First recognizable day token inside a fragment, or null. */
function dayToIndex(fragment) {
  for (const tk of String(fragment).split(/[\s.]+/)) {
    const key = normToken(tk);
    if (key && Object.prototype.hasOwnProperty.call(DAY_TOKENS, key)) {
      return DAY_TOKENS[key];
    }
  }
  return null;
}

/** Parse a day field into a Set of weekday indices + whether we recognized it. */
function parseDays(dayStr) {
  const s = String(dayStr || "").toLowerCase().trim();
  if (!s) return { days: new Set(), matched: false };

  if (/every\s*day|daily|all\s*days|7\s*days/.test(s) || s.includes("ყოველდღ")) {
    return { days: new Set(ALL_DAYS), matched: true };
  }
  if (/weekend/.test(s) || s.includes("შაბ-კვ") || s.includes("შაბ–კვ")) {
    return { days: new Set([0, 6]), matched: true };
  }
  if (/weekday|business\s*day/.test(s)) {
    return { days: new Set([1, 2, 3, 4, 5]), matched: true };
  }

  // Normalize "to"/"until"/Georgian "დან" separators into a plain dash.
  const norm = s.replace(/\s+(?:to|until|დან)\s+/g, "-");

  // Range: two day tokens either side of a dash → inclusive span (wraps week).
  const parts = norm.split(/[–—~-]/);
  if (parts.length === 2) {
    const a = dayToIndex(parts[0]);
    const b = dayToIndex(parts[1]);
    if (a != null && b != null) {
      const days = new Set();
      for (let i = 0; i < 7; i++) {
        const d = (a + i) % 7;
        days.add(d);
        if (d === b) break;
      }
      return { days, matched: true };
    }
  }

  // Otherwise treat it as a list of individual days.
  const days = new Set();
  let matched = false;
  for (const tk of norm.split(/[\s,/;&]+/)) {
    const d = dayToIndex(tk);
    if (d != null) {
      days.add(d);
      matched = true;
    }
  }
  return { days, matched };
}

/** Parse a time field into { start, end } minutes, or a closed/24-7 flag. */
function parseTime(timeStr) {
  const s = String(timeStr || "").trim();
  if (!s) return null;
  if (/closed/i.test(s) || s.includes("დაკეტ")) return { closed: true };
  if (/24\s*[/\\]?\s*7|24\s*(?:hours|hrs|სთ|საათი)|round.?the.?clock/i.test(s)) {
    return { open247: true };
  }
  const m = s.match(/(\d{1,2})[:.](\d{2})\s*[–—~-]\s*(\d{1,2})[:.](\d{2})/);
  if (!m) return null;
  const start = Number(m[1]) * 60 + Number(m[2]);
  const end = Number(m[3]) * 60 + Number(m[4]);
  return { start, end };
}

/**
 * Compute a mechanic's live open/closed state.
 * @returns {{ open: boolean, known: boolean }} `known:false` → fall back to isOpen.
 */
export function getOpenStatus(mechanic, now = new Date()) {
  const hours = mechanic?.hours;
  const fallback = { open: !!mechanic?.isOpen, known: false };
  if (!Array.isArray(hours) || hours.length === 0) return fallback;

  const today = now.getDay();
  const yesterday = (today + 6) % 7;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  let anyDayMatched = false;

  for (const h of hours) {
    const { days, matched } = parseDays(h?.day);
    if (matched) anyDayMatched = true;

    const time = parseTime(h?.time);
    if (!time || time.closed) continue;

    // 24/7 on a listed day (today or an overnight-spanning yesterday) is open.
    if (time.open247 && (days.has(today) || days.has(yesterday))) {
      return { open: true, known: true };
    }

    if (days.has(today)) {
      if (time.end > time.start) {
        if (nowMin >= time.start && nowMin < time.end) return { open: true, known: true };
      } else {
        // Overnight range (e.g. 22:00–04:00): open from start until midnight.
        if (nowMin >= time.start) return { open: true, known: true };
      }
    }

    // Overnight range opened yesterday and still running past midnight today.
    if (days.has(yesterday) && time.end <= time.start && nowMin < time.end) {
      return { open: true, known: true };
    }
  }

  // We understood the schedule but nothing covers right now → genuinely closed.
  if (anyDayMatched) return { open: false, known: true };
  return fallback;
}

/** Convenience: the resolved boolean (schedule if known, else the isOpen flag). */
export function isOpenNow(mechanic, now) {
  return getOpenStatus(mechanic, now).open;
}

/**
 * A Date-ish tick that advances every `intervalMs` so open/closed status stays
 * live without a manual refresh. Returns a millisecond timestamp.
 */
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
