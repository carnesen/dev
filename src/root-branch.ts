import { CliCommandGroup } from '@carnesen/cli';
import { remotesBranch } from './remotes-branch';
import { localsBranch } from './locals-branch';

export const rootBranch = CliCommandGroup({
	name: 'dev',
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [localsBranch, remotesBranch],
});
