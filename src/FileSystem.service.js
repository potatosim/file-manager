import {
  access,
  mkdir,
  readdir,
  rename,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { LoggerService } from './Logger.service.js';

export class FileSystemService extends LoggerService {
  constructor(workingDirectoryService) {
    super();
    this.workingDirectoryService = workingDirectoryService;
  }

  up() {
    this.workingDirectoryService.update('..');
  }

  async cd(path) {
    if (!path) {
      this.logInvalidInput('Please provide a "path_to_directory"!');
      this.workingDirectoryService.log();
      return;
    }

    this.workingDirectoryService.update(path);
  }

  async ls() {
    try {
      const result = await readdir(this.workingDirectoryService.get(), {
        withFileTypes: true,
      });

      const directories = [];
      const files = [];

      result.forEach((item) => {
        if (item.isFile()) {
          files.push({ Name: item.name, Type: 'file' });
        }

        if (item.isDirectory()) {
          directories.push({ Name: item.name, Type: 'directory' });
        }
      });

      console.table([
        ...directories.sort(
          (a, b) => a.Name[0].toLowerCase() - b.Name[0].toLowerCase()
        ),
        ...files.sort(
          (a, b) => a.Name[0].toLowerCase() - b.Name[0].toLowerCase()
        ),
      ]);
    } catch {
      this.logOperationFailed();
    } finally {
      this.workingDirectoryService.log();
    }
  }

  async cat(path) {
    try {
      if (!path) {
        this.logInvalidInput('Please provide a "path_to_file"!');
        this.workingDirectoryService.log();
        return;
      }

      const pathToFile = await this.workingDirectoryService.getValidPath(
        path,
        true
      );

      if (!pathToFile) {
        return;
      }

      const fileStat = await stat(pathToFile);

      if (!fileStat.isFile()) {
        this.logOperationFailed(
          `Seems like "path_to_file=${pathToFile}" is not a file. Please provide a path to file instead!`
        );
        this.workingDirectoryService.log();
        return;
      }

      if (pathToFile) {
        const readStream = createReadStream(pathToFile, {
          encoding: 'utf-8',
        });

        readStream.on('error', (err) => {
          this.logOperationFailed(err.message);
        });

        let result = '';

        readStream.on('data', (chunk) => {
          result += chunk;
        });

        readStream.on('end', () => {
          this.successLog(`Content of file - ${pathToFile}:`);
          console.log(result.trim());
          this.workingDirectoryService.log();
        });

        return;
      }
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }

  async add(fileName) {
    try {
      if (!fileName) {
        return this.logInvalidInput('Please provide a "new_file_name"!');
      }

      const pathToFile = await this.workingDirectoryService.getValidPath(
        basename(fileName),
        false
      );

      if (pathToFile) {
        await writeFile(pathToFile, '', {
          flag: 'wx',
        });

        this.successLog(`File - ${pathToFile}, successfully created!`);

        return;
      }

      this.logOperationFailed();
    } catch (err) {
      this.logOperationFailed(err.message);
    } finally {
      this.workingDirectoryService.log();
    }
  }

  async mkdir(dirName) {
    try {
      if (!dirName) {
        return this.logInvalidInput('Please provide a "new_directory_name"!');
      }

      const directoryPath = await this.workingDirectoryService.getValidPath(
        basename(dirName),
        false
      );

      if (directoryPath) {
        try {
          await access(directoryPath);

          this.logOperationFailed(
            `Directory with name "${basename(
              directoryPath
            )}" is already exists in ${this.workingDirectoryService.get()}`
          );
          return;
        } catch {
          await mkdir(directoryPath);

          this.successLog(
            `Directory - ${directoryPath}, successfully created!`
          );

          return;
        }
      }

      this.logOperationFailed();
    } catch (err) {
      this.logOperationFailed(err.message);
    } finally {
      this.workingDirectoryService.log();
    }
  }

  async rn(oldPath, newPath) {
    try {
      if (!oldPath || !newPath) {
        this.logInvalidInput(
          'Please provide "path_to_file" and "new_filename"!'
        );
        this.workingDirectoryService.log();
        return;
      }

      const oldFileName = await this.workingDirectoryService.getValidPath(
        oldPath,
        true
      );

      if (oldFileName) {
        const fileStats = await stat(oldFileName);

        if (fileStats.isDirectory()) {
          this.logOperationFailed(
            'Seems like you trying to rename directory. Please provide a path to file instead!'
          );
          this.workingDirectoryService.log();
          return;
        }

        // A new path to file should be the same as the old except file/folder name
        const newFileName = join(
          oldFileName?.replace(basename(oldFileName), basename(newPath))
        );

        try {
          await access(newFileName);

          this.logOperationFailed(
            `File\directory with file name - "${basename(
              newPath
            )}" already exists in ${dirname(oldFileName)}`
          );
          this.workingDirectoryService.log();
        } catch {
          await rename(oldFileName, newFileName);

          this.successLog(
            `File ${oldFileName} successfully renamed to ${newFileName}`
          );
          this.workingDirectoryService.log();
        }

        return;
      }
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }

  async cp(pathToFile, destinationPath) {
    try {
      if (!pathToFile || !destinationPath) {
        this.logInvalidInput(
          'Please provide "path_to_file" and "path_to_new_directory"!'
        );
        this.workingDirectoryService.log();
        return;
      }

      const fileToCopy = await this.workingDirectoryService.getValidPath(
        pathToFile,
        true
      );

      if (!fileToCopy) {
        return;
      }

      const fileStat = await stat(fileToCopy);

      if (!fileStat.isFile()) {
        this.logOperationFailed(
          `Seems like "path_to_file=${fileToCopy}" is not a file. Please provide a path to file instead!`
        );
        this.workingDirectoryService.log();
        return;
      }

      const destinationFolder = await this.workingDirectoryService.getValidPath(
        destinationPath,
        true
      );

      if (!destinationFolder) {
        return;
      }

      const folderStat = await stat(destinationFolder);

      if (!folderStat.isDirectory()) {
        this.logOperationFailed(
          `Seems like "path_to_new_directory=${destinationFolder}" is not a folder. Please provide a path to folder instead!`
        );
        this.workingDirectoryService.log();
        return;
      }

      if (fileToCopy && destinationFolder) {
        const readStream = createReadStream(fileToCopy);

        const writeStream = createWriteStream(
          join(destinationFolder, basename(fileToCopy)),
          {
            flags: 'wx',
          }
        );

        readStream.pipe(writeStream);

        writeStream.on('finish', () => {
          this.successLog(
            `File was successfully copied to ${destinationFolder}`
          );
          this.workingDirectoryService.log();
        });

        readStream.on('error', (err) => {
          this.logOperationFailed(err.message);
          this.workingDirectoryService.log();
        });

        writeStream.on('error', (err) => {
          this.logOperationFailed(err.message);
          this.workingDirectoryService.log();
        });

        return;
      }
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }

  async mv(pathToFile, destinationPath) {
    try {
      if (!pathToFile || !destinationPath) {
        this.logInvalidInput(
          'Please provide "path_to_file" and "path_to_new_directory"!'
        );
        this.workingDirectoryService.log();

        return;
      }
      const fileToMove = await this.workingDirectoryService.getValidPath(
        pathToFile,
        true
      );

      if (!fileToMove) {
        return;
      }

      const fileStat = await stat(fileToMove);

      if (!fileStat.isFile()) {
        this.logOperationFailed(
          `Seems like "path_to_file=${fileToMove}" is not a file. Please provide a path to file instead!`
        );
        this.workingDirectoryService.log();

        return;
      }

      const destinationFolder = await this.workingDirectoryService.getValidPath(
        destinationPath,
        true
      );

      if (!destinationFolder) {
        return;
      }

      const folderStat = await stat(destinationFolder);

      if (!folderStat.isDirectory()) {
        this.logOperationFailed(
          `Seems like "path_to_new_directory=${destinationFolder}" is not a folder. Please provide a path to folder instead!`
        );
        this.workingDirectoryService.log();

        return;
      }

      if (fileToMove && destinationFolder) {
        const readStream = createReadStream(fileToMove);
        const writeStream = createWriteStream(
          join(destinationFolder, basename(fileToMove)),
          {
            flags: 'wx',
          }
        );

        readStream.pipe(writeStream);

        writeStream.on('finish', async () => {
          await unlink(fileToMove);
          this.successLog(
            `File with name - ${basename(
              fileToMove
            )} was successfully moved from ${dirname(
              fileToMove
            )} to ${destinationFolder}`
          );
          this.workingDirectoryService.log();
        });

        readStream.on('error', (err) => {
          this.logOperationFailed(err.message);
          this.workingDirectoryService.log();
        });
        writeStream.on('error', (err) => {
          this.logOperationFailed(err.message);
          this.workingDirectoryService.log();
        });
        return;
      }
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }

  async rm(path) {
    try {
      if (!path) {
        this.logInvalidInput('Please provide "path_to_file"!');
        this.workingDirectoryService.log();
        return;
      }

      const resultPath = await this.workingDirectoryService.getValidPath(
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
        this.workingDirectoryService.log();

        return;
      }

      await unlink(resultPath);

      this.successLog(
        `File with name ${basename(
          resultPath
        )} was successfully deleted from ${dirname(resultPath)}`
      );
      this.workingDirectoryService.log();
    } catch (err) {
      this.logOperationFailed(err.message);
      this.workingDirectoryService.log();
    }
  }
}
