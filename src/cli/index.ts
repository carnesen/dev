import { c } from '@carnesen/cli';

import { releaseCommand } from './release.cli-command';
import { prCliCommand } from './pr.cli-command';
import { CARNESEN_DEV_CLI_NAME } from '../constants';
import { writeLicenseCommand } from './write-license.cli-command';
import { prepareReleaseCliCommand } from './prepare-release.cli-command';
import { initCliCommand } from './init.cli-command';
import { statusCliCommand } from './status.cli-command';
import { cloneCliCommand } from './clone.cli-command';
import { cloneCarnesenCliCommand } from './clone-carnesens.cli-command';

const rootBranch = c.commandGroup({
	name: CARNESEN_DEV_CLI_NAME,
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [
		cloneCliCommand,
		cloneCarnesenCliCommand,
		initCliCommand,
		prCliCommand,
		prepareReleaseCliCommand,
		releaseCommand,
		statusCliCommand,
		writeLicenseCommand,
	],
});

export const cli = c.cli(rootBranch);
