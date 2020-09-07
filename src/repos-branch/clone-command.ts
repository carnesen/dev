import { Octokit } from '@octokit/rest';
import { CliCommand } from '@carnesen/cli';
import { usernameArgGroup, repoNameArgGroup } from '../arg-groups';
import { CarnesenRepo } from '../carnesen-repo';

export const cloneCommand = CliCommand({
	name: 'clone',
	description: 'Clone @carnesen repositories',
	namedArgGroups: {
		username: usernameArgGroup,
		name: repoNameArgGroup,
	},
	async action({ namedValues: { username, name } }) {
		let repos: CarnesenRepo[];
		if (name === 'all') {
			const octokit = new Octokit();
			const { data } = await octokit.repos.listForUser({ username });
			const names: string[] = data.map((datum: any) => datum.name);
			repos = names.map((n) => new CarnesenRepo(username, n));
		} else {
			repos = [new CarnesenRepo(username, name)];
		}
		for (const repo of repos) {
			await repo.clone();
		}
	},
});
