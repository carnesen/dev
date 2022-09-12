import { c } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';

export const statusCliCommand = c.command({
	name: 'status',
	description: 'Get Git status from all local repositories',
	action({ color, logger }) {
		const repos = GithubRepo.allLocals();
		for (const repo of repos) {
			const status = repo.status();
			const branch = repo.branch();
			if (status) {
				logger.log(`${color.blue(repo.id)}: ${branch}`);
				logger.log(status);
				logger.log('');
			}
		}
	},
});
