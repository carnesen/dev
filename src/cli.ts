#!/usr/bin/env node

import { runCliAndExit, Cli } from '@carnesen/cli';
import { root } from './root';

if (require.main === module) {
	runCliAndExit(Cli(root));
}
