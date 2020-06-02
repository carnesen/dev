import { CliBranch } from '@carnesen/cli';
import { copyCommonFilesLeaf } from './commands/copy-common-files-leaf';

export const devBranch = CliBranch({
  name: 'dev',
  description: 'A command-line interface (CLI) for @carnesen projects',
  subcommands: [copyCommonFilesLeaf],
});
