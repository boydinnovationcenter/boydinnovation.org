/**
 * Event timing rules, shared by the build and the browser.
 *
 * Event times are written as Columbia, SC wall-clock time ("2026-11-12T18:00"
 * or a date alone, "2026-11-13", meaning the end of that day). An event dims
 * once it has passed and disappears 48 hours later. Times are compared as
 * Eastern wall-clock values, so the result is the same in any time zone.
 */

export const HIDE_AFTER_MS = 48 * 60 * 60 * 1000;

/** Eastern wall-clock time as a comparable number, or null if unreadable. */
export function easternWallClockMs(value: string): number | null {
	const m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
	if (!m) return null;
	return Date.UTC(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 23, m[5] ? +m[5] : 59);
}

/** The current Eastern wall-clock time, comparable with easternWallClockMs. */
export function easternNowMs(now = new Date()): number {
	const parts: Record<string, string> = {};
	new Intl.DateTimeFormat('en-CA', {
		timeZone: 'America/New_York',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	})
		.formatToParts(now)
		.forEach((p) => (parts[p.type] = p.value));
	return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
}

export type EventStatus = 'upcoming' | 'past' | 'hidden';

/** Status of an event that ends at `endsAt` (Eastern wall-clock string). */
export function eventStatus(endsAt: string, nowMs = easternNowMs()): EventStatus {
	const end = easternWallClockMs(endsAt);
	if (end === null || end >= nowMs) return 'upcoming';
	return end < nowMs - HIDE_AFTER_MS ? 'hidden' : 'past';
}

/**
 * ISO 8601 with the Eastern UTC offset for that date (EDT or EST), for
 * structured data: "2026-11-12T18:00" -> "2026-11-12T18:00:00-05:00".
 * Dates without a time are returned unchanged.
 */
export function toEasternIso(value: string): string {
	const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
	if (!m) return value;
	const noonUtc = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
	const tzName = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' })
		.formatToParts(noonUtc)
		.find((p) => p.type === 'timeZoneName')!.value; // e.g. "GMT-5"
	const hours = Number(tzName.replace('GMT', '')) || 0;
	const offset = `${hours < 0 ? '-' : '+'}${String(Math.abs(hours)).padStart(2, '0')}:00`;
	return `${value}:00${offset}`;
}
