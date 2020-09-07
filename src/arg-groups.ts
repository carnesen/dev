import { CliStringArgGroup, CliStringChoiceArgGroup } from '@carnesen/cli';
import { CARNESEN, CARNESEN_ARCHIVE } from './constants';

export const repoNameArgGroup = CliStringArgGroup({
	placeholder: '<repo name> | all',
	required: true,
});

export const usernameArgGroup = CliStringChoiceArgGroup({
	required: true,
	choices: [
		CARNESEN as typeof CARNESEN,
		CARNESEN_ARCHIVE as typeof CARNESEN_ARCHIVE,
	],
});
