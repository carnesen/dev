import { spawnSync } from 'child_process';

export type IRunForegroundOptions = {
	args?: string[];
	cwd?: string;
};

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
}
