import { CliCommand } from '@carnesen/cli';
import { GithubRepo } from '../../github-repo';

export const listCommand = CliCommand({
	name: 'list',
	description: 'List all @carnesen repositories',
	async action() {
		const repos = await GithubRepo.Remotes();
		return repos.map(({ id }) => id).join('\n');
	},
});
