import { Octokit } from '@octokit/rest';
import { CliCommand } from '@carnesen/cli';
import { usernameArgGroup } from '../arg-groups';

export const listCommand = CliCommand({
	name: 'list',
	description: 'List all @carnesen repositories',
	namedArgGroups: {
		username: usernameArgGroup,
	},
	async action({ namedValues: { username } }) {
		const octokit = new Octokit();
		const { data } = await octokit.repos.listForUser({ username });
		return data.map((datum: any) => datum.full_name);
	},
});
