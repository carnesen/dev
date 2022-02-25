import { kebabCase } from 'lodash';
import fs = require('fs');
import {
	CHANGELOG_FILE_NAME,
	LICENSE_FILE_NAME,
	PACKAGE_JSON_FILE_NAME,
	PACKAGE_LOCK_FILE_NAME,
	PROJECT_FILE_NAMES,
	SemverBump,
} from './constants';
import { prepareNextChangelog } from './util/prepare-next-changelog';
import { PackageJson, packageJsonSchema } from './types/package-json';
import { LocalDirectory } from './local-directory';
import { logger } from './util/logger';
import { prepareNextLicense } from './util/prepare-next-license';
import { ReleaseSpec } from './types/release-spec';
import { LicenseName } from './types/license-name';

export class NpmProject extends LocalDirectory {
	constructor(dir = '.') {
		super(dir);
	}

	private npmBackground(...args: string[]): string {
		return this.runBackground('npm', ...args);
	}

	private npmForeground(...args: string[]) {
		logger.log(`Running "npm ${args.join(' ')}"`);
		this.runForeground('npm', ...args);
	}

	private packageJson(): PackageJson {
		const contents = this.readFile(PACKAGE_JSON_FILE_NAME);
		if (!contents) {
			throw new Error(
				`${PACKAGE_JSON_FILE_NAME} not found in ${this.resolvePath()}`,
			);
		}
		const json = JSON.parse(contents);
		return packageJsonSchema.parse(json);
	}

	public npmCi(): void {
		if (this.readFile(PACKAGE_LOCK_FILE_NAME)) {
			logger.log(`Found ${PACKAGE_LOCK_FILE_NAME}`);
			this.npmForeground('ci');
		} else if (this.packageJson()) {
			logger.log(
				`Found ${PACKAGE_JSON_FILE_NAME} but not ${PACKAGE_LOCK_FILE_NAME}. Removing node_modules.`,
			);
			fs.rmSync(this.resolvePath('node_modules'));
			this.npmForeground('install', '--no-save');
		}
	}

	public npmTest(): void {
		if (this.packageJson().scripts?.test) {
			this.npmForeground('test');
		}
	}

	public writeLicense(licenseName: LicenseName | undefined): void {
		const license = this.readFile(LICENSE_FILE_NAME);
		const nextLicense = prepareNextLicense(license || '', licenseName);
		this.writeFile(LICENSE_FILE_NAME, nextLicense);
	}

	/** Prepare an npm project directory for publication for release */
	public prepareRelease(semverBump: SemverBump): ReleaseSpec {
		const license = this.readFile(LICENSE_FILE_NAME);
		if (!license) {
			throw new Error(`Expected to find ${LICENSE_FILE_NAME}`);
		}
		const nextLicense = prepareNextLicense(license);
		this.writeFile(LICENSE_FILE_NAME, nextLicense);

		if (semverBump !== 'none') {
			this.npmBackground('version', semverBump, '--no-git-tag-version');
		}

		const pkg = this.packageJson();
		const releaseName = `${kebabCase(pkg.name)}-${pkg.version}}`;
		const changelog = this.readFile(CHANGELOG_FILE_NAME);

		const { nextChangelog, releaseNotes, releaseTitle } = prepareNextChangelog({
			changelog,
			releaseName,
		});

		if (semverBump !== 'prerelease') {
			this.writeFile(CHANGELOG_FILE_NAME, nextChangelog);
		}

		return {
			releaseName,
			releaseNotes,
			releaseTitle,
		};
	}

	public npmPublish(): void {
		if (!this.packageJson().private) {
			// You'll be prompted for your 2FA one-time password (OTP).
			this.npmForeground('publish');
		}
	}

	public copyProjectFilesTo(dir: string): void {
		const localDir = new LocalDirectory(dir);
		localDir.ensureExists();
		for (const fileName of PROJECT_FILE_NAMES) {
			fs.copyFileSync(
				this.resolvePath(fileName),
				localDir.resolvePath(fileName),
			);
		}
	}
}
