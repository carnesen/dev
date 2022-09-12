import { c } from '@carnesen/cli';
import { SEMVER_BUMPS } from '../constants';
import { NpmProject } from '../npm-project';

export const prepareReleaseCliCommand = c.command({
	name: 'prepare-release',
	hidden: true,
	namedArgGroups: {
		semverBump: c.stringChoice({
			choices: SEMVER_BUMPS,
			description: `
        SemVer segment to bump for the release
      `,
		}),
	},
	action({ namedValues: { semverBump } }) {
		const topLevelNpmProject = new NpmProject();
		topLevelNpmProject.prepareRelease(semverBump);
	},
});
