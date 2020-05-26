import path = require('path');
import os = require('os');
import mkdirp = require('mkdirp');
import { copyFileSync } from 'fs';
import { CARNESEN_DEV_DIR } from './constants';

export class CarnesenRepo {
  public readonly name: string;

  private readonly path: string;

  constructor(name: string) {
    this.name = name;
    this.path = path.join(os.homedir(), 'GitHub', name);
  }

  public copyFromDev(relativePath: string): void {
    const source = path.join(CARNESEN_DEV_DIR, relativePath);
    const destination = path.join(this.path, relativePath);
    mkdirp.sync(path.dirname(destination));
    copyFileSync(source, destination);
  }
}
