export const LICENSE_NAMES = ['mit', 'proprietary'] as const;

export type LicenseName = typeof LICENSE_NAMES[number];
