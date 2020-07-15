import { CliCommand } from '@carnesen/cli';
import { repoNameArgGroup, usernameArgGroup } from '../arg-groups';
import { CarnesenRepo } from '../carnesen-repo';
import { consoleLog } from '../util';
import { INDENT } from '../constants';

export const initCommand = CliCommand({
	name: 'init',
	description: 'Copy common files from this repository to the target one',
	namedArgGroups: {
		username: usernameArgGroup,
		name: repoNameArgGroup,
	},
	async action(_, { username, name }) {
		const repo = new CarnesenRepo(username, name);
		consoleLog(`Copying files to ${repo.name}`);
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
			consoleLog(`${INDENT}${relativePath}`);
			await repo.copyFromDev(relativePath);
		}
	},
});