import { CliCommandGroup } from '@carnesen/cli';
import { initNewCommand } from '../init-new-command';
import { reposBranch } from '../repos-branch';

export const rootBranch = CliCommandGroup({
	name: 'dv',
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [initNewCommand, reposBranch],
});
