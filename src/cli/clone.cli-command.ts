import { CliCommand, CliStringArgGroup } from '@carnesen/cli';

import { GithubRepo } from '../github-repo';

export const cloneCliCommand = CliCommand({
	name: 'clone',
	description: 'Clone a repo by its GitHub ID',
	positionalArgGroup: CliStringArgGroup({
		placeholder: '<id>',
		description: 'GitHub repository identifier e.g. carnesen/cli',
		required: true,
	}),
	action({ positionalValue: id }) {
		const repo = new GithubRepo(id);
		repo.clone();
	},
});
