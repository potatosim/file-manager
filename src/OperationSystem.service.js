import { EOL, arch, cpus, homedir, type } from 'node:os';
import { LoggerService } from './Logger.service.js';

export class OperationSystemService extends LoggerService {
  constructor(workingDirectoryService) {
    super();
    this.workingDirectoryService = workingDirectoryService;
  }

  os(command) {
    switch (command) {
      case '--EOL':
        return this.getEndOfLine();
      case '--cpus':
        return this.getCPUS();
      case '--homedir':
        return this.getHomeDir();
      case '--username':
        return this.getSystemUserName();
      case '--architecture':
        return this.getCPUArchitecture();
      default:
        this.logInvalidInput(
          `Unknown argument "${command}". Please, try again `
        );
        return this.workingDirectoryService.log();
    }
  }

  getEndOfLine() {
    this.successLog(`End-of-line character is ${JSON.stringify(EOL)}`);
    this.workingDirectoryService.log();
  }

  getCPUS() {
    const CPUSInfo = cpus();
    const resultInfo = CPUSInfo.map(({ model, speed }) => {
      return { Model: model.trim(), 'Clock rate': `${speed / 1000} GHz` };
    });
    this.successLog(`CPUS count: ${cpus().length}`);
    console.table(resultInfo);

    this.workingDirectoryService.log();
  }

  getHomeDir() {
    this.successLog(`Current user's home directory is ${homedir()}`);
    this.workingDirectoryService.log();
  }

  getSystemUserName() {
    this.successLog(`The operating system name is ${type()}`);
    this.workingDirectoryService.log();
  }

  getCPUArchitecture() {
    this.successLog(`The operating system CPU architecture is ${arch()}`);
    this.workingDirectoryService.log();
  }
}
