import path = require('path');
import {
	CliCommand,
	CliStringArgGroup,
	CliStringArrayArgGroup,
	CliStringChoiceArgGroup,
} from '@carnesen/cli';
import {
	CHANGELOG_FILE_NAME,
	CLI_NAME,
	PROJECT_FILE_NAMES,
	SEMVER_BUMPS,
} from '../constants';
import { NpmProject } from '../npm-project';
import { GithubRepo } from '../github-repo';

const RELEASE_COMMAND_NAME = 'release';

export const releaseCommand = CliCommand({
	name: RELEASE_COMMAND_NAME,
	positionalArgGroup: CliStringArrayArgGroup({
		description: `
      Zero or more project subdirectory names (Default: ".")
      `,
		placeholder: '[<project0> ...]',
	}),
	namedArgGroups: {
		semverBump: CliStringChoiceArgGroup({
			choices: SEMVER_BUMPS,
			description: `
        SemVer segment to bump for the release
      `,
			required: true,
		}),
		outDir: CliStringArgGroup({
			description: `
        Project-relative path of the subdirectory containing built output project (Default: ".")
        `,
		}),
		inDir: CliStringArgGroup({
			description: `
        Path of the source input subdirectory project (Default: ".")
        `,
		}),
	},
	description({ ansi }) {
		return `
Release one or more packages using npm and git

${ansi.bold('** Examples **')}

Release a single-project repository package:

$ ${CLI_NAME} ${RELEASE_COMMAND_NAME} --bump minor

Release a GraphQL schema package in a subdirectory "graphql-schema"

$ ${CLI_NAME} ${RELEASE_COMMAND_NAME} graphql-schema --bump minor

Release a monorepo sub-project whose source code is in "libs/http-client" that
builds to "dist/libs/http-client":

$ ${CLI_NAME} ${RELEASE_COMMAND_NAME} http-client --bump minor --outDir dist --inDir libs

${ansi.bold('** Steps **')}

At the top level of the repository:

* Run "npm ci" or "npm install" to make sure the installed package 
dependencies are up to date

* Run "npm test" which must build the package(s) as one of its steps

In <inDir>/<project> for each <project>:

* Run "npm version" to bump the package.json version unless semverBump="none"

* If bump does not start with "pre", update ${CHANGELOG_FILE_NAME} replacing 
"Upcoming" with the current release name and today's date

* Copy ${PROJECT_FILE_NAMES.join(', ')} to <outDir>/<inDir>/<project>

In <outDir>/<inDir>/<project> for each <project>:

* If private is not \`true\` in package.json, run "npm publish"

If bump does not start with "pre", at the top level of the repository:

* Create a new commit from "." with message e.g. "project0-0.1.2 project1-0.1.2"

* Push the commit to the current branch on GitLab

* Push a tag e.g. project0-0.1.2 for each released project
`;
	},
	action({
		positionalValue: projectNames = ['.'],
		namedValues: { semverBump, inDir = '.', outDir = '.' },
	}) {
		const topLevelNpmProject = new NpmProject();
		topLevelNpmProject.npmCi();
		topLevelNpmProject.npmTest();
		const releaseSpecs = projectNames.map((projectName) => {
			const inProjectDir = path.resolve(inDir, projectName);
			const outProjectDir = path.resolve(outDir, inDir, projectName);
			const inNpmProject = new NpmProject(inProjectDir);
			const releaseSpec = inNpmProject.prepareRelease(semverBump);
			inNpmProject.copyProjectFilesTo(outProjectDir);
			const outNpmProject = new NpmProject(outProjectDir);
			outNpmProject.npmPublish();
			return releaseSpec;
		});
		if (!semverBump.startsWith('pre')) {
			const gitRepo = GithubRepo.fromCwd();
			gitRepo.commitTagPushRelease(releaseSpecs);
		}
	},
});
