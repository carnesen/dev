import { CliStringArgParser } from '@carnesen/cli';

export const repoNameArgParser = CliStringArgParser({
  placeholder: '<repo name> | all',
  required: true,
});
