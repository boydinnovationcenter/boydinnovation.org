import { getCollection, type CollectionEntry } from 'astro:content';

export type PastEvent = CollectionEntry<'pastEvents'>;

/** Past event pages, oldest first (the order of Squarespace's previous/next links). */
export async function getPastEvents(): Promise<PastEvent[]> {
	const events = await getCollection('pastEvents');
	return events.sort((a, b) => a.data.start.localeCompare(b.data.start));
}

export const pastEventUrl = (event: PastEvent) => `/event-calendar/${event.id}`;

/** Wall-clock "2026-03-19T17:00" as a Date whose UTC fields hold those values. */
const wall = (value: string) => new Date(`${value}:00Z`);

/** "Thursday, March 19, 2026" */
export const eventDate = (value: string) =>
	wall(value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** "March 19" */
export const eventDateShort = (value: string) =>
	wall(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });

/** "5:00 PM" */
export const eventTime = (value: string) =>
	wall(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
