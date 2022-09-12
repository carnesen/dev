import fs = require('fs');
import path = require('path');
import os = require('os');

import { Octokit } from '@octokit/rest';

import { USERNAMES } from './constants';
import { runForeground } from './util/run-foreground';
import { LocalToday } from './util/local-today';
import { LocalDirectory } from './local-directory';
import { logger } from './util/logger';
import { sleep } from './util/sleep';
import { ReleaseSpec } from './types/release-spec';

export class GithubRepo extends LocalDirectory {
	public constructor(public readonly id: string) {
		super(path.join(GithubRepo.BaseDir, ...id.split('/')));
	}

	/**
	 * Clone this repository to this.resolvePath if it doesn't already exist
	 */
	public clone(): void {
		if (this.exists()) {
			logger.log(`repo:${this.id} already exists`);
			return;
		}
		this.ensureParentExists();
		const sshUrl = `git@github.com:${this.id}.git`;
		logger.log(`repo:${this.id} cloning ...`);
		runForeground('git', { args: ['clone', sshUrl], cwd: this.parent() });
		logger.log(`repo:${this.id} cloned`);
	}

	private gitBackground(...args: string[]): string {
		return this.runBackground('git', ...args);
	}

	private gitForeground(...args: string[]): void {
		logger.log(`Running "git ${args.join(' ')}"`);
		this.runForeground('git', ...args);
	}

	private ghForeground(...args: string[]): void {
		logger.log(`Running "gh ${args.join(' ')}"`);
		this.runForeground('gh', ...args);
	}

	public branch(): string {
		return this.gitBackground('branch', '--show-current');
	}

	public status(): string {
		return this.gitBackground('status', '--porcelain');
	}

	/**
	 * Create a PR and merge it when checks pass
	 * @param options
	 */
	public pr(): void {
		// Start by committing the code on a new branch
		const originalBranch = this.branch();
		if (GithubRepo.DefaultBranches.includes(originalBranch)) {
			const newBranch = `ca-${LocalToday()}`;
			this.gitForeground('switch', '-c', newBranch);
		}
		if (this.status()) {
			this.gitForeground('add', '.');
			this.gitForeground('commit');
		}

		this.ghForeground('pr', 'create', '--fill');

		// Wait for a few seconds to give the workflow a chance to start
		logger.log(
			'Waiting a few seconds for the GitHub Actions workflow to start',
		);

		sleep(5000);

		this.ghForeground('run', 'watch');

		this.ghForeground('pr', 'merge');

		this.gitForeground('pull');
	}

	/**
	 * Create a new commit and tag(s) and push them to GitHub then create a
	 * GitHub release for each tag
	 * @param moreReleaseSpecs
	 */
	public commitTagPushRelease(releaseSpecs: ReleaseSpec[]): void {
		if (this.status()) {
			this.gitForeground('add', '.');
			this.gitForeground(
				'commit',
				'--message',
				releaseSpecs.map(({ releaseName }) => releaseName).join(' '),
			);
		}

		// Create the release tags and push them
		for (const { releaseName } of releaseSpecs) {
			this.gitForeground('tag', releaseName);
			this.gitForeground('push', 'origin', `refs/tags/${releaseName}`);
		}

		// Wait for a few seconds to give the workflow a chance to start
		logger.log(
			'Waiting a few seconds for the GitHub Actions workflow to start',
		);

		sleep(5000);

		// Wait for GitHub Actions workflow to complete
		this.ghForeground('run', 'watch');

		for (const { releaseName, releaseNotes, releaseTitle } of releaseSpecs) {
			// Create GitHub "release" for each tag
			this.ghForeground(
				'release',
				'create',
				releaseName,
				'--title',
				releaseTitle,
				'--notes',
				releaseNotes,
			);
		}

		// Push the commit to the branch. Previously we only pushed the tag.
		this.gitForeground('push', '--set-upstream', 'origin', this.branch());
	}

	public static readonly BaseDir = path.join(os.homedir(), 'GitHub');

	public static readonly DefaultBranches = ['master', 'main'];

	public static carnesenRemotes = async (): Promise<GithubRepo[]> => {
		const octokit = new Octokit();
		const repos: GithubRepo[] = [];
		for (const username of USERNAMES) {
			const { data } = await octokit.repos.listForUser({ username });
			for (const datum of data) {
				repos.push(new GithubRepo(datum.full_name));
			}
		}
		return repos;
	};

	public static allLocals = (): GithubRepo[] => {
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
				repos.push(new GithubRepo(`${scope}/${repoName}`));
			}
		}

		return repos;
	};

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
