import { c } from '@carnesen/cli';
import { LICENSE_FILE_NAME } from '../constants';

import { NpmProject } from '../npm-project';
import { LICENSE_NAMES } from '../types/license-name';

export const writeLicenseCommand = c.command({
	name: 'write-license',
	description: `Write ${LICENSE_FILE_NAME}`,
	positionalArgGroup: c.stringChoice({
		choices: LICENSE_NAMES,
		optional: true,
	}),
	async action({ positionalValue: licenseName }) {
		const project = new NpmProject(process.cwd());
		project.writeLicense(licenseName);
	},
});
