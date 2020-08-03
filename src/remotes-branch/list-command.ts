import { CliCommand } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';

export const listCommand = CliCommand({
	name: 'list',
	description: 'List all @carnesen repositories',
	async action({ console }) {
		const repos = await GithubRepo.Remotes({ console });
		return repos.map(({ id }) => id).join('\n');
	},
});
