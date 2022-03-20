import { CliCommand } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';

export const statusCliCommand = CliCommand({
	name: 'status',
	description: 'Get Git status from all local repositories',
	action({ console, ansi }) {
		const repos = GithubRepo.allLocals();
		for (const repo of repos) {
			const status = repo.status();
			const branch = repo.branch();
			if (status) {
				console.log(`${ansi.blue(repo.id)}: ${branch}`);
				console.log(status);
				console.log('');
			}
		}
	},
});
