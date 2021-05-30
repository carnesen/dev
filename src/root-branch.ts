import { CliCommandGroup } from '@carnesen/cli';
import { remotesBranch } from './remotes-branch';
import { localsBranch } from './locals-branch';
import { publishCommand } from './publish-command';
import { prCommand } from './pr-command';

export const rootBranch = CliCommandGroup({
	name: 'dev',
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [prCommand, publishCommand, localsBranch, remotesBranch],
});
