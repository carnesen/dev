import { CliBranch } from '@carnesen/cli';
import { listLocalsCommand } from './list-locals-command';
import { initLocalsCommand } from './init-locals-command';
import { statusLocalsCommand } from './status-locals-command';

export const localsBranch = CliBranch({
	name: 'locals',
	subcommands: [listLocalsCommand, statusLocalsCommand, initLocalsCommand],
});
