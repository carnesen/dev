import { CliCommand, CliStringArgGroup } from '@carnesen/cli';
import path = require('path');
import {
	CHANGELOG_FILE_NAME,
	INDENT,
	PACKAGE_JSON_FILE_NAME,
	README_FILE_NAME,
} from '../../constants';
import { GithubRepo } from '../../github-repo';
import { NpmProject } from '../../npm-project';
import { INITIAL_CHANGELOG } from '../../util/prepare-next-changelog';

export const initLocalsCommand = CliCommand({
	name: 'init',
	description: 'Copy common files from this repository to the target one',
	positionalArgGroup: CliStringArgGroup({
		required: true,
		placeholder: '<id>',
	}),
	async action({ positionalValue: id, console }) {
		const npmProject = new NpmProject(path.join(GithubRepo.BaseDir, id));
		console.log(`Copying files to ${id}`);
		for (const relativePath of [
			'.github/workflows/test.yml',
			'src/index.ts',
			'.eslintrc.json',
			'.gitattributes',
			'.gitignore',
			'.npmrc',
			'.nvmrc',
			'cspell.json',
			'jest.config.js',
			PACKAGE_JSON_FILE_NAME,
			README_FILE_NAME,
			'tsconfig.json',
		]) {
			console.log(`${INDENT}${relativePath}`);
			await npmProject.copyFileToHereFromCarnesenDev(relativePath);
		}
		npmProject.writeLicense('mit');
		npmProject.writeFile(CHANGELOG_FILE_NAME, INITIAL_CHANGELOG);
	},
});
