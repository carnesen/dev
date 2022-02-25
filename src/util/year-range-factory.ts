export function yearRangeFactory(from: string, to?: string): string {
	return to ? `${from}-${to}` : from;
}
