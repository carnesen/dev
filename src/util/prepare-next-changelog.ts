import { LocalToday } from './local-today';

export interface PrepareNextChangelogOptions {
	/** A markdown changelog */
	changelog: string | undefined;
	/** A release name e.g. "foo-bar-0.1.2" */
	releaseName: string;
}

export interface PrepareNextChangelogResult {
	nextChangelog: string;
	releaseTitle: string;
	releaseNotes: string;
}

const SUBSECTION_HEADER_IDENTIFIER = '\n## ';

const UPCOMING = 'Upcoming';

const UPCOMING_PART = `${UPCOMING}\n`;

export const INITIAL_CHANGELOG = `# changelog\n${SUBSECTION_HEADER_IDENTIFIER}${UPCOMING_PART}`;

export function prepareNextChangelog(
	options: PrepareNextChangelogOptions,
): PrepareNextChangelogResult {
	const { changelog = INITIAL_CHANGELOG, releaseName } = options;
	const parts = changelog.split(SUBSECTION_HEADER_IDENTIFIER);
	if (parts.length < 2) {
		throw new Error(
			`Expected changelog to have at least one subsection header starting with "##\\n"`,
		);
	}

	const [introPart, upcomingPart, ...restParts] = parts;

	if (!upcomingPart.startsWith(UPCOMING)) {
		throw new Error(`Expected first section header to be "${UPCOMING}"`);
	}

	const releaseNotes = upcomingPart.slice(UPCOMING.length).trim();
	const releaseDate = LocalToday();
	const releaseTitle = `${releaseName} (${releaseDate})`;
	const releasePart = `${releaseTitle}\n\n${releaseNotes}\n`;
	const nextParts = [introPart, UPCOMING_PART, releasePart, ...restParts];
	const nextChangelog = nextParts.join(SUBSECTION_HEADER_IDENTIFIER);

	return {
		nextChangelog,
		releaseTitle,
		releaseNotes,
	};
}
