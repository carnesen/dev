#!/usr/bin/env node

import { runCliAndExit } from '@carnesen/cli';
import { rootCommand } from './root-command';

// This package has no exports
export {};

if (require.main === module) {
  runCliAndExit(rootCommand);
}
