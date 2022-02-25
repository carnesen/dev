import { Cli, CliCommandGroup } from '@carnesen/cli';

import { remotesBranch } from './remotes-branch';
import { localsBranch } from './locals-branch';
import { releaseCommand } from './release-command';
import { prCommand } from './pr-command';
import { CLI_NAME } from '../constants';
import { writeLicenseCommand } from './write-license-command';

const rootBranch = CliCommandGroup({
	name: CLI_NAME,
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [
		prCommand,
		releaseCommand,
		localsBranch,
		remotesBranch,
		writeLicenseCommand,
	],
});

export const cli = Cli(rootBranch);
