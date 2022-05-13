export class ErrorResponse {
  timestamp: Date;
  code: number;
  message: string;
  prettierMessage: string;

  constructor(
    timestamp = new Date(),
    code = -1,
    message = "",
    prettierMessage = ""
  ) {
    this.timestamp = timestamp;
    this.code = code;
    this.message = message;
    this.prettierMessage = prettierMessage;
  }
}
