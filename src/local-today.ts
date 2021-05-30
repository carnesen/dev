const MILLISECONDS_PER_MINUTE = 60_000;

/**
 * Generate an YYYY-MM-DD date string for the local time zone (Ref:
 * https://stackoverflow.com/a/28149561)
 */
export function LocalToday(): string {
	const date = new Date();
	const offset = date.getTimezoneOffset() * MILLISECONDS_PER_MINUTE;
	return new Date(date.valueOf() - offset).toISOString().substring(0, 10);
}
