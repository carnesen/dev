import { CliCommandGroup } from '@carnesen/cli';
import { listCommand } from './list-command';
import { cloneCommand } from './clone-command';

export const remotesBranch = CliCommandGroup({
	name: 'remotes',
	subcommands: [cloneCommand, listCommand],
});
