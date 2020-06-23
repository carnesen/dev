export function consoleLog(...args: Parameters<typeof console.log>): void {
	console.log(...args); // eslint-disable-line no-console
}

export function consoleError(...args: Parameters<typeof console.error>): void {
	console.error(...args); // eslint-disable-line no-console
}
