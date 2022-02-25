#!/usr/bin/env node

import { cli } from './cli';

if (require.main === module) {
	cli.run();
}

// This package has no exports
export {};
