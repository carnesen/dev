import { CliCommand, CliStringChoiceArgGroup } from '@carnesen/cli';
import { SEMVER_BUMPS } from '../constants';
import { NpmProject } from '../npm-project';

export const prepareReleaseCliCommand = CliCommand({
	name: 'prepare-release',
	hidden: true,
	namedArgGroups: {
		semverBump: CliStringChoiceArgGroup({
			choices: SEMVER_BUMPS,
			description: `
        SemVer segment to bump for the release
      `,
			required: true,
		}),
	},
	action({ namedValues: { semverBump } }) {
		const topLevelNpmProject = new NpmProject();
		topLevelNpmProject.prepareRelease(semverBump);
	},
});
