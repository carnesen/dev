import { runBackground } from './run-background';

export function sleep(milliseconds: number): void {
	const script = `setTimeout(() => process.exit(0), ${milliseconds})`;
	runBackground('node', {
		args: ['--eval', script],
	});
}
