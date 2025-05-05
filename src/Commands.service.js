import { LoggerService } from './Logger.service.js';

export class CommandsService extends LoggerService {
  constructor(
    workingDirectoryService,
    greetingsService,
    fileSystemService,
    operationSystemService,
    hashService,
    compressService
  ) {
    super();
    this.workingDirectoryService = workingDirectoryService;
    this.greetingsService = greetingsService;
    this.fileSystemService = fileSystemService;
    this.operationSystemService = operationSystemService;
    this.hashService = hashService;
    this.compressService = compressService;
  }

  parseCommand(commandString) {
    const [command, ...args] = commandString
      .toString()
      .split(' ')
      .map((item) => item.trim());

    if (command === '.exit') {
      this.greetingsService.sayBye();
      process.exit();
    }

    if (this.fileSystemService[command]) {
      return this.fileSystemService[command](...args);
    }

    if (this.operationSystemService[command]) {
      return this.operationSystemService[command](...args);
    }

    if (this.hashService[command]) {
      return this.hashService[command](...args);
    }

    if (this.compressService[command]) {
      return this.compressService[command](...args);
    }

    this.logInvalidInput(`Command '${command}' doesn't exist`);
    this.workingDirectoryService.log();
  }
}
