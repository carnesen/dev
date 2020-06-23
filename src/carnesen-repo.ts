import path = require('path');
import os = require('os');
import mkdirp = require('mkdirp');
import { copyFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { CARNESEN_DEV_DIR, TUserName } from './constants';
import { runChildProcessSync } from './run-child-process';
import { consoleLog } from './util';

export class CarnesenRepo {
	public readonly username: string;

	public readonly name: string;

	private readonly path: string;

	constructor(username: TUserName, name: string) {
		this.username = username;
		this.name = name;
		this.path = path.join(os.homedir(), 'GitHub', username, name);
	}

	public fullName(): string {
		return `${this.username}/${this.name}`;
	}

	/**
	 * Copy a file from this repo (dev) to the CarnesenRepo
	 * @param relativePath
	 */
	public copyFromDev(relativePath: string): void {
		const source = path.join(CARNESEN_DEV_DIR, relativePath);
		const destination = path.join(this.path, relativePath);
		mkdirp.sync(path.dirname(destination));
		copyFileSync(source, destination);
	}

	/**
	 * Clone this repository to this.path if it doesn't already exist
	 */
	public async clone(): Promise<void> {
		if (existsSync(this.path)) {
			consoleLog(`repo:${this.fullName()} already exists`);
			return;
		}
		const parentDir = dirname(this.path);
		mkdirp.sync(parentDir);
		const sshUrl = `git@github.com:${this.username}/${this.name}.git`;
		consoleLog(`repo:${this.fullName()} cloning ...`);
		runChildProcessSync('git', ['clone', sshUrl], { cwd: parentDir });
		consoleLog(`repo:${this.fullName()} cloned`);
	}
}
