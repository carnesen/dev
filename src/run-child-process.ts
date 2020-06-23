import { spawnSync } from 'child_process';

export function runChildProcessSync(
	exe: string,
	args?: string[],
	opts: { cwd?: string } = {},
): void {
	const out = spawnSync(exe, args || [], {
		cwd: opts.cwd,
		stdio: 'inherit',
	});
	if (out.error) {
		throw out.error;
	}
}
