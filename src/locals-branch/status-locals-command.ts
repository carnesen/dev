import { CliCommand } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';

export const statusLocalsCommand = CliCommand({
	name: 'status',
	description: 'Get Git status from all local repositories',
	async action({ console, ansi }) {
		const repos = GithubRepo.Locals({ console });
		for (const repo of repos) {
			const status = await repo.status();
			const branch = await repo.branch();
			if (status) {
				console.log(`${ansi.blue(repo.id)}: ${branch}`);
				console.log(status);
				console.log('');
			}
		}
	},
});
