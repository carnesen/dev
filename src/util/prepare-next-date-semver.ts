import { nowMonthFactory } from './now-month-factory';
import { nowYearFactory } from './now-year-factory';

export function prepareNextDateSemver(semver: string): string {
	const [year, month, sequenceNumber] = semver.split('.');
	const fourDigitsRegexp = /^[0-9]{4}$/;
	const oneOrMoreDigitsRegexp = /^[0-9]+$/;
	if (
		!(
			fourDigitsRegexp.test(year) &&
			oneOrMoreDigitsRegexp.test(month) &&
			oneOrMoreDigitsRegexp.test(sequenceNumber)
		)
	) {
		throw new Error(`Current version "${semver}" is not a date semver`);
	}
	const nowYear = nowYearFactory();
	const nowMonth = nowMonthFactory();
	const nextSequenceNumber =
		nowYear === year && nowMonth === month
			? (Number(sequenceNumber) + 1).toString()
			: '0';
	return [nowYear, nowMonth, nextSequenceNumber].join('.');
}
