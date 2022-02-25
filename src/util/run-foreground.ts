import { spawnSync } from 'child_process';

export type IRunForegroundOptions = {
	args?: string[];
	cwd?: string;
};

/**
 * Synchronously spawn a child process with standard streams inherited from this
 * one
 * @param exe Executable program name e.g. "git"
 * @param options Optional execution configuration e.g. arguments, cwd
 * @throws An error reported by spawnSync if there is one
 */

export function runForeground(
	exe: string,
	options: IRunForegroundOptions = {},
): void {
	const { cwd, args = [] } = options;
	const out = spawnSync(exe, args, {
		cwd,
		stdio: 'inherit',
	});
	if (out.error) {
		throw out.error;
	}
	if (out.status !== 0) {
		throw new Error(`Child exited with non-zero status ${out.status}`);
	}
}
