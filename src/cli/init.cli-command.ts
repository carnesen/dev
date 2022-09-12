import { c } from '@carnesen/cli';
import {
	CHANGELOG_FILE_NAME,
	LICENSE_FILE_NAME,
	PACKAGE_JSON_FILE_NAME,
	README_FILE_NAME,
} from '../constants';
import { NpmProject } from '../npm-project';
import { INITIAL_CHANGELOG } from '../util/prepare-next-changelog';

const ALL_PROJECT_FILE_NAMES = [
	'.github/workflows/test.yml',
	'src/index.ts',
	'.eslintrc.json',
	'.gitattributes',
	'.nvmrc',
	'cspell.json',
	PACKAGE_JSON_FILE_NAME,
	'jest.config.js',
	'tsconfig.json',
].sort();

export const initCliCommand = c.command({
	name: 'init',
	description() {
		const carnesenDevPackageName = NpmProject.carnesenDev.packageJson().name;
		return `Initialize the current working directory as a @carnesen project
		
		Copy over the following files from ${carnesenDevPackageName}:

		${ALL_PROJECT_FILE_NAMES.map((name) => `- ${name}\n\n`).join('')}
		
		Write ${LICENSE_FILE_NAME}

		Write ${CHANGELOG_FILE_NAME}

		Write ${README_FILE_NAME}

		Run "npm ci"

		Run "npm install ${carnesenDevPackageName}"
		`;
	},
	action({ logger }) {
		const npmProject = new NpmProject(process.cwd());
		logger.log(`Copying files`);
		for (const relativePath of ALL_PROJECT_FILE_NAMES) {
			logger.log(`- ${relativePath}`);
			npmProject.copyFileToThisFromCarnesenDev(relativePath);
		}
		npmProject.writeLicense('mit');
		npmProject.writeFile(CHANGELOG_FILE_NAME, INITIAL_CHANGELOG);
		const readme = NpmProject.carnesenDev.readFile(README_FILE_NAME);
		if (!readme) {
			throw new Error('Expected readme');
		}
		const nextReadme = readme.replaceAll(
			'carnesen/dev',
			`carnesen/${npmProject.basename()}`,
		);
		// Since "npm publish" never includes .gitignore we need to jump through
		// hoops to put a copy of it in the package
		// https://github.com/npm/npm/issues/3763

		for (const fileName of ['.gitignore', '.npmrc']) {
			const nextFileContents =
				NpmProject.carnesenDev.readFile(`${fileName}.copy`) || '';
			npmProject.writeFile(fileName, nextFileContents);
		}
		npmProject.writeFile(README_FILE_NAME, nextReadme);
		npmProject.updatePackageJson(() => ({
			name: `@carnesen/${npmProject.basename()}`,
			version: '0.0.0-0',
			description: '',
			private: true,
			bin: undefined,
			dependencies: {},
			publishConfig: undefined,
			repository: `github:carnesen/${npmProject.basename()}`,
			bugs: {
				url: `https://github.com/carnesen/${npmProject.basename()}/issues`,
			},
			homepage: `https://github.com/carnesen/${npmProject.basename()}#readme`,
			_files: undefined,
			files: ['src', '!src/**/__tests__', 'lib', '!lib/**/__tests__'],
		}));
		npmProject.npmForeground('install');
		npmProject.npmForeground(
			'install',
			'--save-dev',
			NpmProject.carnesenDev.packageJson().name,
		);
	},
});
