import { Cli, CliCommandGroup } from '@carnesen/cli';

import { remotesBranch } from './remotes-branch';
import { localsBranch } from './locals-branch';
import { releaseCommand } from './release-command';
import { prCommand } from './pr-command';
import { CARNESEN_DEV_CLI_NAME } from '../constants';
import { writeLicenseCommand } from './write-license-command';
import { prepareReleaseCommand } from './prepare-release-command';
import { initCommand } from './init-command';

const rootBranch = CliCommandGroup({
	name: CARNESEN_DEV_CLI_NAME,
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [
		initCommand,
		prCommand,
		prepareReleaseCommand,
		releaseCommand,
		localsBranch,
		remotesBranch,
		writeLicenseCommand,
	],
});

export const cli = Cli(rootBranch);
