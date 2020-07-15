#!/usr/bin/env node

import { Cli } from '@carnesen/cli';
import { rootBranch } from './root-branch';

const cli = Cli(rootBranch);

if (require.main === module) {
	cli.run();
}

// This package has no exports
export {};
