import { c } from '@carnesen/cli';

import { GithubRepo } from '../github-repo';

export const cloneCliCommand = c.command({
	name: 'clone',
	description: 'Clone a repo by its GitHub ID',
	positionalArgGroup: c.string({
		placeholder: '<id>',
		description: 'GitHub repository identifier e.g. carnesen/cli',
	}),
	action({ positionalValue: id }) {
		const repo = new GithubRepo(id);
		repo.clone();
	},
});
