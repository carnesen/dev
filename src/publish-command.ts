import {
	CliCommand,
	CliStringArgGroup,
	CliStringChoiceArgGroup,
} from '@carnesen/cli';

import { GithubRepo } from './github-repo';

const BUMP_CHOICES = [
	'patch' as const,
	'minor' as const,
	'major' as const,
	'none' as const,
];

export const publishCommand = CliCommand({
	name: 'publish',
	description: 'Publish a project package to npm',
	positionalArgGroup: CliStringArgGroup({
		placeholder: '<id>',
	}),
	namedArgGroups: {
		bump: CliStringChoiceArgGroup({
			required: true,
			choices: BUMP_CHOICES,
		}),
	},
	async action({ namedValues: { bump }, positionalValue: id, console }) {
		const repo = id ? new GithubRepo(id, { console }) : GithubRepo.fromCwd();
		await repo.publish({ bump });
	},
});
