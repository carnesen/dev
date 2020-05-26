import { CliLeaf } from '@carnesen/cli';
import { repoNameArgParser } from './repo-name-arg-parser';
import { CarnesenRepo } from './carnesen-repo';
import { consoleLog } from './util';
import { INDENT } from './constants';

export const copyCommonFilesLeaf = CliLeaf({
  name: 'copy-common-files',
  description: 'Copy common files from this repository to the target one',
  positionalArgParser: repoNameArgParser,
  async action(repoName) {
    const repo = new CarnesenRepo(repoName);
    consoleLog(`Copying files to ${repo.name}`);
    for (const relativePath of [
      '.github/workflows/test.yml',
      '.npmrc',
      '.nvmrc',
      '.eslintrc.json',
      '.gitignore',
    ]) {
      consoleLog(`${INDENT}${relativePath}`);
      await repo.copyFromDev(relativePath);
    }
  },
});
