import { CliCommand } from '@carnesen/cli';

import { GithubRepo } from '../github-repo';

export const prCliCommand = CliCommand({
	name: 'pr',
	description: 'Commit changes, create a PR, and merge it',
	async action() {
		const repo = GithubRepo.fromCwd();
		await repo.pr();
	},
});
