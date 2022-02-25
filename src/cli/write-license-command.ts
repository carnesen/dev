import { CliCommand, CliStringChoiceArgGroup } from '@carnesen/cli';
import { LICENSE_FILE_NAME } from '../constants';

import { NpmProject } from '../npm-project';
import { LICENSE_NAMES } from '../types/license-name';

export const writeLicenseCommand = CliCommand({
	name: 'write-license',
	description: `Write ${LICENSE_FILE_NAME}`,
	positionalArgGroup: CliStringChoiceArgGroup({
		choices: LICENSE_NAMES,
	}),
	async action({ positionalValue: licenseName }) {
		const project = new NpmProject(process.cwd());
		project.writeLicense(licenseName);
	},
});
