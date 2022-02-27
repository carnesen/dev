import { CliCommandGroup } from '@carnesen/cli';
import { listLocalsCommand } from './list-locals-command';
import { statusLocalsCommand } from './status-locals-command';

export const localsBranch = CliCommandGroup({
	name: 'locals',
	subcommands: [listLocalsCommand, statusLocalsCommand],
});
