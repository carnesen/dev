import { LocalToday } from '../local-today';
import { prepareNextChangelog } from '../prepare-next-changelog';

const changelog = `
# Blah blah

## Upcoming

- Some change

## v0.1.2`;

const releaseName = 'v1.2.3';
const releaseTitle = `${releaseName} (${LocalToday()})`;

const nextChangelog = `
# Blah blah

## Upcoming

## ${releaseTitle}

- Some change

## v0.1.2`;

describe(prepareNextChangelog.name, () => {
	it('Does the right thing on an example', () => {
		const result = prepareNextChangelog({
			changelog,
			releaseName: 'v1.2.3',
		});
		expect(result.nextChangelog).toBe(nextChangelog);
		expect(result.releaseNotes).toBe('- Some change');
		expect(result.releaseTitle).toBe(releaseTitle);
	});
});
