import { LicenseName } from '../types/license-name';
import { nowYearFactory } from './now-year-factory';
import { mitLicenseFactory, MIT_LICENSE_HEADER } from './mit-license-factory';
import {
	proprietaryLicenseFactory,
	PROPRIETARY_LICENSE_HEADER,
} from './proprietary-license-factory';

export function prepareNextLicense(
	license: string,
	licenseName?: LicenseName,
): string {
	const nowYear = nowYearFactory();
	let licenseFactory: (yearRange: string) => string;
	if (
		licenseName === 'proprietary' ||
		license.includes(PROPRIETARY_LICENSE_HEADER)
	) {
		licenseFactory = proprietaryLicenseFactory;
	} else if (licenseName === 'mit' || license.includes(MIT_LICENSE_HEADER)) {
		licenseFactory = mitLicenseFactory;
	} else {
		throw new Error(
			`License text includes neither "${PROPRIETARY_LICENSE_HEADER}" nor "${MIT_LICENSE_HEADER}"`,
		);
	}

	const singleFullYearMatched = license.match(/ ([0-9]{4}) /);
	if (singleFullYearMatched) {
		const existingSingleFullYear = singleFullYearMatched[1];
		if (existingSingleFullYear === nowYear) {
			return licenseFactory(nowYear);
		}
		return licenseFactory(`${existingSingleFullYear}-${nowYear}`);
	}

	const fullYearRangeMatched = license.match(/ ([0-9]{4})-[0-9]{4} /);
	if (fullYearRangeMatched) {
		const [, initialYear] = fullYearRangeMatched;
		return licenseFactory(`${initialYear}-${nowYear}`);
	}

	// Existing license does not have a year or year range
	return licenseFactory(nowYear);
}
