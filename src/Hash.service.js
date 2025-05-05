import { createHash } from 'node:crypto';
import { LoggerService } from './Logger.service.js';
import { access, readFile, stat } from 'node:fs/promises';

export class HashService extends LoggerService {
  constructor(currentWorkingDirectory) {
    super();
    this.currentWorkingDirectory = currentWorkingDirectory;
  }

  async hash(path) {
    try {
      if (!path) {
        this.logInvalidInput('Please provide "path_to_file"!');
        this.currentWorkingDirectory.log();
        return;
      }

      const resultPath = await this.currentWorkingDirectory.getValidPath(
        path,
        true
      );

      if (!resultPath) {
        return;
      }

      const fileStat = await stat(resultPath);

      if (!fileStat.isFile()) {
        this.logOperationFailed(
          `Seems like "path_to_file=${resultPath}" is not a file. Please provide a path to file instead!`
        );
        this.currentWorkingDirectory.log();
        return;
      }

      if (resultPath) {
        const fileData = await readFile(resultPath, { encoding: 'utf-8' });

        const hash = createHash('sha256');

        hash.update(fileData);

        this.successLog(hash.digest('hex'));
        this.currentWorkingDirectory.log();
        return;
      }

      this.logOperationFailed();
    } catch (err) {
      this.logOperationFailed(err.message);
      this.currentWorkingDirectory.log();
    }
  }
}
