import path = require('path');
export const THIS_PROJECT_DIR = path.dirname(__dirname);
export const INDENT = '\t';
export const CARNESEN = 'carnesen';
export const CARNESEN_ARCHIVE = 'carnesen-archive';
export type TUserName = typeof CARNESEN | typeof CARNESEN_ARCHIVE;
export const USERNAMES = [
	CARNESEN as typeof CARNESEN,
	CARNESEN_ARCHIVE as typeof CARNESEN_ARCHIVE,
];
