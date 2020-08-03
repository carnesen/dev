import { CliCommand } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';

export const listLocalsCommand = CliCommand({
	name: 'list',
	description: 'List all local repositories',
	action({ console }) {
		const repos = GithubRepo.Locals({ console });
		return repos.map(({ id }) => id).join('\n');
	},
});
