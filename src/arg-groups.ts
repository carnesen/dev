import { CliStringArgGroup, CliOneOfArgGroup } from '@carnesen/cli';
import { CARNESEN, CARNESEN_ARCHIVE } from './constants';

export const repoNameArgGroup = CliStringArgGroup({
	placeholder: '<repo name> | all',
	required: true,
});

export const usernameArgGroup = CliOneOfArgGroup({
	required: true,
	values: [
		CARNESEN as typeof CARNESEN,
		CARNESEN_ARCHIVE as typeof CARNESEN_ARCHIVE,
	],
});
