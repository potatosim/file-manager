import { EOL, homedir } from 'node:os';
import { isAbsolute, join, parse } from 'node:path';
import { access, stat } from 'node:fs/promises';
import { LoggerService } from './Logger.service.js';

export class WorkingDirectoryService extends LoggerService {
  constructor() {
    super();
    this.rootPath = parse(homedir()).root;
    this.workingDirectory = homedir();
  }

  async update(path) {
    try {
      const updatedPath = isAbsolute(path)
        ? path
        : join(this.workingDirectory, path);

      if (this.isValidPath(updatedPath)) {
        await access(updatedPath);
        const stats = await stat(updatedPath);

        if (stats.isDirectory()) {
          this.workingDirectory = updatedPath;
        } else {
          this.logInvalidInput(
            'Seems like you provide a path to file as "path_to_directory", please provide a path to directory instead!'
          );
        }
        return;
      }

      this.logInvalidInput(
        'You are trying to access path outside root! Permission denied!'
      );
    } catch (err) {
      this.logOperationFailed(err.message);
    } finally {
      this.log();
    }
  }

  log() {
    console.log(
      this.blue + `You are currently in ${this.workingDirectory}` + this.reset
    );
  }

  isValidPath(path) {
    return path.startsWith(this.rootPath);
  }

  get() {
    return this.workingDirectory;
  }

  async getValidPath(path, checkAccess) {
    try {
      const correctPath = isAbsolute(path)
        ? path
        : join(this.workingDirectory, path);

      if (this.isValidPath(correctPath)) {
        if (checkAccess) {
          await access(correctPath);
        }

        return correctPath;
      }

      this.logInvalidInput(
        'You are trying to access path outside root! Permission denied!'
      );
      this.log();
      return null;
    } catch (err) {
      throw err;
    }
  }
}
