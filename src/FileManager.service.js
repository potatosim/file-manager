import { CommandsService } from './Commands.service.js';
import { CompressService } from './Compress.service.js';
import { FileSystemService } from './FileSystem.service.js';
import { GreetingsService } from './Greetings.service.js';
import { HashService } from './Hash.service.js';
import { OperationSystemService } from './OperationSystem.service.js';
import { WorkingDirectoryService } from './WorkingDirectory.service.js';
import { stdin } from 'node:process';

export class FileManagerService {
  constructor() {}

  init() {
    const workingDirectoryService = new WorkingDirectoryService();

    const greetingsService = new GreetingsService(workingDirectoryService);

    const fileSystemService = new FileSystemService(workingDirectoryService);

    const operationSystemService = new OperationSystemService(
      workingDirectoryService
    );

    const hashService = new HashService(workingDirectoryService);

    const compressService = new CompressService(workingDirectoryService);

    const commandsService = new CommandsService(
      workingDirectoryService,
      greetingsService,
      fileSystemService,
      operationSystemService,
      hashService,
      compressService
    );

    this.commandsService = commandsService;

    return this;
  }

  start() {
    stdin.on('data', (data) => {
      this.commandsService.parseCommand(data);
    });
  }
}
