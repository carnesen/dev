import { CliCommand, CliStringArgGroup } from '@carnesen/cli';
import { GithubRepo } from '../github-repo';
import { INDENT } from '../constants';

export const initLocalsCommand = CliCommand({
	name: 'init',
	description: 'Copy common files from this repository to the target one',
	positionalArgGroup: CliStringArgGroup({
		required: true,
		placeholder: '<id>',
	}),
	async action({ positionalValue: id, console }) {
		const repo = new GithubRepo(id, { console });
		console.log(`Copying files to ${repo.id}`);
		for (const relativePath of [
			'.github/workflows/test.yml',
			'src/index.ts',
			'.eslintrc.json',
			'.gitattributes',
			'.gitignore',
			'.npmrc',
			'.nvmrc',
			'changelog.md',
			'jest.config.js',
			'license.txt',
			'package.json',
			'tsconfig.json',
		]) {
			console.log(`${INDENT}${relativePath}`);
			await repo.copyFromDev(relativePath);
		}
	},
});
