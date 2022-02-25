import path = require('path');
export const THIS_PROJECT_DIR = path.dirname(__dirname);
export const INDENT = '\t';
export const CARNESEN = 'carnesen';
export const CARNESEN_ARCHIVE = 'carnesen-archive';
export const USERNAMES = [CARNESEN, CARNESEN_ARCHIVE] as const;

export const CLI_NAME = 'carnesen-dev';

export const CHANGELOG_FILE_NAME = 'changelog.md';
export const LICENSE_FILE_NAME = 'license.md';
export const PACKAGE_JSON_FILE_NAME = 'package.json';
export const PACKAGE_LOCK_FILE_NAME = 'package-lock.json';
export const README_FILE_NAME = 'readme.md';

export const PROJECT_FILE_NAMES = [
	CHANGELOG_FILE_NAME,
	LICENSE_FILE_NAME,
	PACKAGE_JSON_FILE_NAME,
	README_FILE_NAME,
] as const;

export const SEMVER_BUMPS = [
	'none',
	'prerelease',
	'preminor',
	'minor',
	'premajor',
	'major',
	'prepatch',
	'patch',
	'predate',
	'date',
] as const;
export type SemverBump = typeof SEMVER_BUMPS[number];
