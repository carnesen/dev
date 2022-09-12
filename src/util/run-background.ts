import cp = require('child_process');
import { CCliTerseError } from '@carnesen/cli';
export type RunSubprocessOptions = {
	/** Arguments passed to the program invocation */
	args?: string[];
	/** Current working directory from which to spawn the subprocess */
	cwd?: string;
};
/**
 * Spawn a child process, collecting its output in memory until it terminates.
 * @param exe Executable program name e.g. "git"
 * @param options Optional execution configuration e.g. arguments, cwd
 * @returns The child's trimmed standard output
 */
export function runBackground(
	exe: string,
	options: RunSubprocessOptions = {},
): string {
	const { args = [], cwd } = options;
	const { error, status, stdout, stderr } = cp.spawnSync(exe, args, {
		cwd,
		encoding: 'utf8',
	});
	if (error) {
		throw error;
	}
	const trimmedStdout = stdout.trim();
	if (status) {
		let message = `Process exited with non-zero status code ${String(status)}`;
		message += '\n\n';
		message += `$ ${exe} ${args.join(' ')}`;
		message += '\n\n';
		if (trimmedStdout) {
			message += 'stdout:';
			message += '\n\n';
			message += trimmedStdout;
		}
		const trimmedStderr = stderr.trim();
		if (trimmedStderr) {
			message += 'stdout:';
			message += '\n\n';
			message += trimmedStdout;
		}
		throw new CCliTerseError(message);
	}
	return trimmedStdout;
}
