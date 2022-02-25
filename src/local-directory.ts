import fs = require('fs');
import path = require('path');

import { THIS_PROJECT_DIR } from './constants';
import { runForeground } from './util/run-foreground';
import { runBackground } from './util/run-background';
import { errorLikeFactory } from './util/error-like-factory';
import { logger } from './util/logger';

export class LocalDirectory {
	constructor(protected readonly dir: string) {}

	/**
	 * Get the fully qualified path of this local directory or one if its
	 * subdirectories
	 * @param parts Additional path segments to join in beyond the repo root
	 * @returns The fully qualified path of this directory or one of its
	 * subdirectories
	 */
	public resolvePath(...parts: string[]): string {
		return path.resolve(this.dir, ...parts);
	}

	protected parent(): string {
		return path.dirname(this.resolvePath());
	}

	/**
	 * Copy a file from carnesen/dev to `this` directory
	 * @param relativePath
	 */
	public copyFileToHereFromCarnesenDev(relativePath: string): void {
		const source = path.join(THIS_PROJECT_DIR, relativePath);
		const destination = path.join(this.resolvePath(), relativePath);
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.copyFileSync(source, destination);
	}

	protected runBackground(exe: string, ...args: string[]): string {
		return runBackground(exe, { args, cwd: this.resolvePath() });
	}

	protected runForeground(exe: string, ...args: string[]): void {
		runForeground(exe, { args, cwd: this.resolvePath() });
	}

	protected readFile(fileName: string): string | undefined {
		try {
			const str = fs.readFileSync(this.resolvePath(fileName), {
				encoding: 'utf8',
			});
			return str;
		} catch (exception) {
			const errorLike = errorLikeFactory(exception);
			if (errorLike.code !== 'ENOENT') {
				throw exception;
			}
		}
		return undefined;
	}

	protected writeFile(fileName: string, contents: string): void {
		fs.writeFileSync(this.resolvePath(fileName), contents);
		logger.log(`Wrote ${fileName}`);
	}

	protected exists(): boolean {
		return fs.existsSync(this.resolvePath());
	}

	public ensureExists(): void {
		fs.mkdirSync(this.resolvePath(), { recursive: true });
	}

	protected ensureParentExists(): void {
		fs.mkdirSync(this.parent(), { recursive: true });
	}
}
