import { CliCommandGroup } from '@carnesen/cli';
import { listCommand } from './list-command';
import { cloneCommand } from './clone-command';

export const reposBranch = CliCommandGroup({
	name: 'repos',
	subcommands: [cloneCommand, listCommand],
});
