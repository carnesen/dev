import { c } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';

export const cloneCarnesenCliCommand = c.command({
	name: 'clone-carnesens',
	description: 'Clone @carnesen repositories',
	async action() {
		const repos = await GithubRepo.carnesenRemotes();
		for (const repo of repos) {
			repo.clone();
		}
	},
});
