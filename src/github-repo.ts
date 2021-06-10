import fs = require('fs');
import path = require('path');
import os = require('os');
import mkdirp = require('mkdirp');

import { ICliConsole } from '@carnesen/cli';
import { CliConsole } from '@carnesen/cli/lib/cli-console';
import { Octokit } from '@octokit/rest';

import { THIS_PROJECT_DIR, USERNAMES } from './constants';
import { runForeground } from './run-foreground';
import { runBackground } from './run-background';
import { prepareNextChangelog } from './prepare-next-changelog';
import { LocalToday } from './local-today';
import { PackageJson, packageJsonSchema } from './package-json';

export interface GithubRepoOptions {
	console?: ICliConsole;
}

export interface GithubRepoPublishOptions {
	/** SemVer segment to bump */
	bump: 'patch' | 'minor' | 'major' | 'none';
}

export class GithubRepo {
	private readonly console: ICliConsole;

	public readonly id: string;

	public static readonly BaseDir = path.join(os.homedir(), 'GitHub');

	public static readonly DefaultBranches = ['master', 'main'];

	public static Remotes = async (
		options: GithubRepoOptions,
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

	public static Locals = (options: GithubRepoOptions): GithubRepo[] => {
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

	constructor(id: string, options: GithubRepoOptions = {}) {
		this.console = options.console || CliConsole();
		this.id = id;
	}

	private parts(): string[] {
		return this.id.split('/');
	}

	/**
	 * Get the fully qualified path of this repository or one if its
	 * subdirectories
	 * @param parts Additional path segments to join in beyond the repo root
	 * @returns The fully qualified path of this repo or one of its
	 * subdirectories
	 */
	private path(...parts: string[]): string {
		return path.join(GithubRepo.BaseDir, ...this.parts(), ...parts);
	}

	/**
	 * Copy a file from this repo (dev) to the CarnesenRepo
	 * @param relativePath
	 */
	public copyFromDev(relativePath: string): void {
		const source = path.join(THIS_PROJECT_DIR, relativePath);
		const destination = path.join(this.path(), relativePath);
		mkdirp.sync(path.dirname(destination));
		fs.copyFileSync(source, destination);
	}

	/**
	 * Clone this repository to this.path if it doesn't already exist
	 */
	public clone(): void {
		if (fs.existsSync(this.path())) {
			this.console.log(`repo:${this.id} already exists`);
			return;
		}
		const parentDir = path.dirname(this.path());
		mkdirp.sync(parentDir);
		const sshUrl = `git@github.com:${this.id}.git`;
		this.console.log(`repo:${this.id} cloning ...`);
		runForeground('git', { args: ['clone', sshUrl], cwd: parentDir });
		this.console.log(`repo:${this.id} cloned`);
		if (fs.existsSync(this.path('package-lock.json'))) {
			this.console.log('Found package-lock.json. Running "npm ci".');
			this.npmForeground('ci');
		} else if (fs.existsSync(this.path('package.json'))) {
			this.console.log(
				'Found package.json but not package-lock.json. Running "npm install".',
			);
			this.npmForeground('install');
		}
	}

	private async npmBackground(...args: string[]): Promise<string> {
		return await runBackground('npm', { args, cwd: this.path() });
	}

	private npmForeground(...args: string[]) {
		this.console.log(`Running "npm ${args.join(' ')}"`);
		runForeground('npm', { args, cwd: this.path() });
	}

	private packageJson(): PackageJson {
		const str = fs.readFileSync(this.path('package.json'), {
			encoding: 'utf8',
		});

		const json = JSON.parse(str);
		return packageJsonSchema.parse(json);
	}

	private async gitBackground(...args: string[]): Promise<string> {
		const result = await runBackground('git', { args, cwd: this.path() });
		return result.trim();
	}

	private gitForeground(...args: string[]): void {
		this.console.log(`Running "git ${args.join(' ')}"`);
		runForeground('git', { args, cwd: this.path() });
	}

	private ghForeground(...args: string[]): void {
		this.console.log(`Running "gh ${args.join(' ')}"`);
		runForeground('gh', { args, cwd: this.path() });
	}

	public async branch(): Promise<string> {
		return await this.gitBackground('branch', '--show-current');
	}

	public async status(): Promise<string> {
		return await this.gitBackground('status', '--porcelain');
	}

	/**
	 * Create a PR and merge it when checks pass
	 * @param options
	 */
	public async pr(): Promise<void> {
		// Start by committing the code on a new branch
		const originalBranch = await this.branch();
		if (GithubRepo.DefaultBranches.includes(originalBranch)) {
			const newBranch = `ca-${LocalToday()}`;
			this.gitForeground('switch', '-c', newBranch);
		}
		this.gitForeground('add', '.');
		this.gitForeground('commit');

		this.ghForeground('pr', 'create', '--fill');

		// Wait for a few seconds to give the workflow a chance to start
		this.console.log(
			'Waiting a few seconds for the GitHub Actions workflow to start',
		);
		await new Promise((resolve) => setTimeout(resolve, 5000));

		this.ghForeground('run', 'watch');

		this.ghForeground('pr', 'merge');

		this.gitForeground('pull');
	}

	/**
	 * Publish a project package to GitHub and the npm registry
	 * @param options
	 */
	public async publish(options: GithubRepoPublishOptions): Promise<void> {
		const { bump } = options;
		const packageJson = this.packageJson();
		/** The new semantic version prepended with "v" e.g. v0.1.2. */
		let releaseName: string;
		if (bump === 'none') {
			releaseName = `v${packageJson.version}`;
		} else {
			releaseName = await this.npmBackground(
				'version',
				bump,
				'--no-git-tag-version',
			);
		}

		const changelogPath = this.path('changelog.md');
		const changelog = fs.readFileSync(changelogPath, {
			encoding: 'utf8',
		});

		const { nextChangelog, releaseNotes, releaseTitle } = prepareNextChangelog({
			changelog,
			releaseName,
		});

		fs.writeFileSync(changelogPath, nextChangelog);

		// The --no-git-tag-version above disabled all Git actions, not just the
		// tagging. We'll create the commit now and push it later.
		this.gitForeground('add', '.');
		this.gitForeground('commit', '--message', releaseName);

		// Reinstall dependencies to make sure they're up to date
		this.npmForeground('ci');

		this.npmForeground('test');

		if (!packageJson.private) {
			// You'll be prompted for your 2FA one-time password (OTP).
			this.npmForeground('publish');
		}

		// Create the release tag and push it.
		this.gitForeground('tag', releaseName);
		this.gitForeground('push', 'origin', `refs/tags/${releaseName}`);

		// Wait for a few seconds to give the workflow a chance to start
		this.console.log(
			'Waiting a few seconds for the GitHub Actions workflow to start',
		);
		await new Promise((resolve) => setTimeout(resolve, 5000));

		// Wait for GitHub Actions workflow to complete
		this.ghForeground('run', 'watch');

		// Create GitHub "release"
		this.ghForeground(
			'release',
			'create',
			releaseName,
			'--title',
			releaseTitle,
			'--notes',
			releaseNotes,
		);

		// Push the commit to the branch. Previously we only pushed the tag.
		this.gitForeground('push');
	}

	public static fromCwd(): GithubRepo {
		const cwd = process.cwd();
		if (!cwd.startsWith(GithubRepo.BaseDir)) {
			throw new Error(
				`Your current working directory is not a GitHub repository. Please cd to ${GithubRepo.BaseDir}`,
			);
		}
		const id = cwd.slice(GithubRepo.BaseDir.length);
		return new GithubRepo(id);
	}
}
