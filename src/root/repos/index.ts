import { CliBranch } from '@carnesen/cli';
import { listCommand } from './list-command';
import { cloneCommand } from './clone-command';

export const reposBranch = CliBranch({
	name: 'repos',
	subcommands: [cloneCommand, listCommand],
});
