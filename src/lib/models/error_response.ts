export class ErrorResponse {
  timestamp: Date;
  code: number;
  message: string;
  prettierMessage: string;

  constructor(
    timestamp: Date,
    code: number,
    message: string,
    prettierMessage = ""
  ) {
    this.timestamp = timestamp;
    this.code = code;
    this.message = message;
    this.prettierMessage = prettierMessage;
  }
}
