import { CliBranch } from '@carnesen/cli';
import { reposBranch } from '../repos-branch';

export const rootBranch = CliBranch({
	name: 'dev',
	description: 'A command-line interface (CLI) for @carnesen projects',
	subcommands: [reposBranch],
});
