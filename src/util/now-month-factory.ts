export function nowMonthFactory(): string {
	return (new Date().getMonth() + 1).toString();
}
