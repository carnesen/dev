import path = require('path');
import os = require('os');
import mkdirp = require('mkdirp');
import fs = require('fs');

import { ICliConsole } from '@carnesen/cli';
import { CliConsole } from '@carnesen/cli/lib/cli-console';
import { Octokit } from '@octokit/rest';

import { THIS_PROJECT_DIR, USERNAMES } from './constants';
import { runForeground } from './run-foreground';
import { runSubprocess } from './run-subprocess';

export interface IGithubRepoOptions {
	console?: ICliConsole;
}

export class GithubRepo {
	private readonly console: ICliConsole;

	public readonly id: string;

	public static BaseDir = path.join(os.homedir(), 'GitHub');

	public static Remotes = async (
		options: IGithubRepoOptions,
	): Promise<GithubRepo[]> => {
		const octokit = new Octokit();
		const repos: GithubRepo[] = [];
		for (const username of USERNAMES) {
			const { data } = await octokit.repos.listForUser({ username });
			for (const datum of data) {
				repos.push(new GithubRepo(datum.full_name, options));
			}
		}
		return repos;
	};

	public static Locals = (options: IGithubRepoOptions): GithubRepo[] => {
		const repos: GithubRepo[] = [];
		if (!fs.existsSync(GithubRepo.BaseDir)) {
			return repos;
		}
		const scopes = fs
			.readdirSync(GithubRepo.BaseDir)
			.filter((name) => !name.startsWith('.'));
		for (const scope of scopes) {
			const scopePath = path.join(GithubRepo.BaseDir, scope);
			const repoNames = fs
				.readdirSync(scopePath)
				.filter((name) => !name.startsWith('.'));
			for (const repoName of repoNames) {
				repos.push(new GithubRepo(`${scope}/${repoName}`, options));
			}
		}

		return repos;
	};

	constructor(id: string, options: IGithubRepoOptions = {}) {
		this.console = options.console || CliConsole();
		this.id = id;
	}

	private parts(): string[] {
		return this.id.split('/');
	}

	private dir(): string {
		return path.join(GithubRepo.BaseDir, ...this.parts());
	}

	/**
	 * Copy a file from this repo (dev) to the CarnesenRepo
	 * @param relativePath
	 */
	public copyFromDev(relativePath: string): void {
		const source = path.join(THIS_PROJECT_DIR, relativePath);
		const destination = path.join(this.dir(), relativePath);
		mkdirp.sync(path.dirname(destination));
		fs.copyFileSync(source, destination);
	}

	/**
	 * Clone this repository to this.path if it doesn't already exist
	 */
	public clone(): void {
		if (fs.existsSync(this.dir())) {
			this.console.log(`repo:${this.id} already exists`);
			return;
		}
		const parentDir = path.dirname(this.dir());
		mkdirp.sync(parentDir);
		const sshUrl = `git@github.com:${this.id}.git`;
		this.console.log(`repo:${this.id} cloning ...`);
		runForeground('git', { args: ['clone', sshUrl], cwd: parentDir });
		this.console.log(`repo:${this.id} cloned`);
	}

	private async gitSubprocess(...args: string[]): Promise<string> {
		const result = await runSubprocess('git', { args, cwd: this.dir() });
		return result.trim();
	}

	public async status(): Promise<string> {
		return await this.gitSubprocess('status', '--porcelain');
	}
}
