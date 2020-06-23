import { CliBranch } from '@carnesen/cli';
import { initNewCommand } from './init-new';
import { reposBranch } from './repos';

export const root = CliBranch({
	name: 'dev',
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [initNewCommand, reposBranch],
});
