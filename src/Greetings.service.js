import { argv, stdout, stdin } from 'node:process';
import { LoggerService } from './Logger.service.js';

export class GreetingsService extends LoggerService {
  constructor(workingDirectoryService) {
    super();
    this.workingDirectoryService = workingDirectoryService;
    this.userName = argv?.[2]?.split('=').at(-1) ?? 'Unknown user';

    this.sayHello();

    process.on('SIGINT', () => {
      this.sayBye();
      process.exit();
    });
  }

  sayHello() {
    console.log(
      this.green + `Welcome to the File Manager, ${this.userName}!` + this.reset
    );
    this.workingDirectoryService.log();
  }

  sayBye() {
    console.log(
      this.green +
        `Thank you for using File Manager, ${this.userName}, goodbye!` +
        this.reset
    );
  }
}
