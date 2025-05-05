export class LoggerService {
  constructor() {
    this.yellow = '\x1b[33m';
    this.red = '\x1b[31m';
    this.green = '\x1b[32m';
    this.reset = '\x1b[0m';
    this.blue = '\x1b[34m';
  }

  logInvalidInput(customMessage = '') {
    console.warn(this.yellow + `Invalid input! ${customMessage}` + this.reset);
  }

  logOperationFailed(customMessage = '') {
    console.error(this.red + `Operation failed! ${customMessage}` + this.reset);
  }

  successLog(message = '') {
    console.log(this.green + message + this.reset);
  }
}
