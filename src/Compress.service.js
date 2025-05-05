import { createReadStream, createWriteStream } from 'node:fs';
import { LoggerService } from './Logger.service.js';

import { basename, extname, join } from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { stat } from 'node:fs/promises';

export class CompressService extends LoggerService {
  constructor(workingDirectoryService) {
    super();
    this.workingDirectoryService = workingDirectoryService;
  }

  async compress(pathToFile, pathToDestination) {
    if (!pathToFile || !pathToDestination) {
      this.logInvalidInput(
        'Please provide "path_to_file" "path_to_destination"!'
      );
      this.workingDirectoryService.log();
      return;
    }

    try {
      const fileToCompress = await this.workingDirectoryService.getValidPath(
        pathToFile,
        true
      );

      if (!fileToCompress) {
        return;
      }

      const fileStat = await stat(fileToCompress);

      if (!fileStat.isFile()) {
        this.logOperationFailed(
          `Seems like "path_to_file=${fileToCompress}" is not a file. Please provide a path to file instead!`
        );
        this.workingDirectoryService.log();

        return;
      }

      const destinationPath = await this.workingDirectoryService.getValidPath(
        pathToDestination,
        true
      );

      if (!destinationPath) {
        return;
      }

      const destinationStat = await stat(destinationPath);

      if (!destinationStat.isDirectory()) {
        this.logOperationFailed(
          `Seems like "path_to_destination=${destinationPath}" is not a folder. Please provide a path to folder instead!`
        );
        this.workingDirectoryService.log();

        return;
      }

      if (fileToCompress && destinationPath) {
        const readStream = createReadStream(fileToCompress);

        const writeStream = createWriteStream(
          this.getArchivePath(destinationPath, fileToCompress),
          {
            flags: 'wx',
          }
        );

        const brotliCompress = createBrotliCompress();

        [readStream, writeStream, brotliCompress].forEach((stream) => {
          stream.on('error', (err) => {
            this.logOperationFailed(err.message);
            this.workingDirectoryService.log();
          });
        });

        writeStream.on('finish', () => {
          this.successLog(
            `File - ${fileToCompress} was successfully compressed to ${this.getArchivePath(
              destinationPath,
              fileToCompress
            )}`
          );
          this.workingDirectoryService.log();
        });

        readStream.pipe(brotliCompress).pipe(writeStream);
      }
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }

  async decompress(pathToFile, pathToDestination) {
    if (!pathToFile || !pathToDestination) {
      this.logInvalidInput(
        'Please provide "path_to_file" "path_to_destination"!'
      );
      this.workingDirectoryService.log();
      return;
    }

    try {
      const fileToDecompress = await this.workingDirectoryService.getValidPath(
        pathToFile,
        true
      );

      if (!fileToDecompress) {
        return;
      }

      const fileStat = await stat(fileToDecompress);

      if (!fileStat.isFile()) {
        this.logOperationFailed(
          `Seems like "path_to_file=${fileToDecompress}" is not a file. Please provide a path to file instead!`
        );
        this.workingDirectoryService.log();

        return;
      }

      const destinationPath = await this.workingDirectoryService.getValidPath(
        pathToDestination,
        true
      );

      if (!destinationPath) {
        return;
      }

      const destinationStat = await stat(destinationPath);

      if (!destinationStat.isDirectory()) {
        this.logOperationFailed(
          `Seems like "path_to_destination=${destinationPath}" is not a folder. Please provide a path to folder instead!`
        );
        this.workingDirectoryService.log();

        return;
      }

      if (fileToDecompress && destinationPath) {
        const readStream = createReadStream(fileToDecompress);

        const writeStream = createWriteStream(
          this.getFilePath(destinationPath, fileToDecompress),
          {
            flags: 'wx',
          }
        );

        const brotliDecompress = createBrotliDecompress();

        [readStream, writeStream, brotliDecompress].forEach((stream) => {
          stream.on('error', (err) => {
            this.logOperationFailed(err.message);
            this.workingDirectoryService.log();
          });
        });

        writeStream.on('finish', () => {
          this.successLog(
            `File - ${fileToDecompress} was successfully decompressed to ${this.getFilePath(
              destinationPath,
              fileToDecompress
            )}`
          );
          this.workingDirectoryService.log();
        });

        readStream.pipe(brotliDecompress).pipe(writeStream);
      }
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }

  getArchivePath(destinationPath, filePath) {
    return join(destinationPath, `${basename(filePath)}.br`);
  }

  getFilePath(destinationPath, filePath) {
    return join(destinationPath, `${basename(filePath).replace('.br', '')}`);
  }
}
