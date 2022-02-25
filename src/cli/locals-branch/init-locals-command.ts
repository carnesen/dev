import { CliCommand, CliStringArgGroup } from '@carnesen/cli';
import { INDENT } from '../../constants';
import { LocalDirectory } from '../../local-directory';

export const initLocalsCommand = CliCommand({
	name: 'init',
	description: 'Copy common files from this repository to the target one',
	positionalArgGroup: CliStringArgGroup({
		required: true,
		placeholder: '<id>',
	}),
	async action({ positionalValue: id, console }) {
		const localDirectory = new LocalDirectory(id);
		console.log(`Copying files to ${id}`);
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
			await localDirectory.copyFileToHereFromCarnesenDev(relativePath);
		}
	},
});
