import { copyrightFactory } from './copyright-factory';

export const PROPRIETARY_LICENSE_HEADER = 'All rights reserved';

export function proprietaryLicenseFactory(yearRange: string): string {
	return `${PROPRIETARY_LICENSE_HEADER}

${copyrightFactory(yearRange)}

Unauthorized copying of this software via any medium is strictly prohibited.

Proprietary and confidential.
`;
}
