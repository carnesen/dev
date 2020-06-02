#!/usr/bin/env node

import { runCliAndExit } from '@carnesen/cli';
import { devBranch } from './dev-branch';

// This package has no exports
export {};

if (require.main === module) {
  runCliAndExit(devBranch);
}
