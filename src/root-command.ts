import { CliBranch } from '@carnesen/cli';
import { copyCommonFilesLeaf } from './copy-common-files-leaf';

export const rootCommand = CliBranch({
  name: 'dev',
  description: 'A command-line interface (CLI) for @carnesen projects',
  subcommands: [copyCommonFilesLeaf],
});
