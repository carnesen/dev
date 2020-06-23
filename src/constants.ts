import { resolve } from 'path';
export const CARNESEN_DEV_DIR = resolve(__dirname, '..');
export const INDENT = '\t';
export const CARNESEN = 'carnesen';
export const CARNESEN_ARCHIVE = 'carnesen-archive';
export type TUserName = typeof CARNESEN | typeof CARNESEN_ARCHIVE;
