import { CliBranch } from '@carnesen/cli';
import { listCommand } from './list-command';
import { cloneCommand } from './clone-command';

export const remotesBranch = CliBranch({
	name: 'remotes',
	subcommands: [cloneCommand, listCommand],
});
