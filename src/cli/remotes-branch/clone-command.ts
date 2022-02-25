// import { Octokit } from '@octokit/rest';
import { CliCommand } from '@carnesen/cli';
import { GithubRepo } from '../../github-repo';

export const cloneCommand = CliCommand({
	name: 'clone',
	description: 'Clone @carnesen repositories',
	async action() {
		const repos = await GithubRepo.Remotes();
		for (const repo of repos) {
			await repo.clone();
		}
	},
});
