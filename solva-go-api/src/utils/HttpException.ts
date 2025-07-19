/**
 * Custom HTTP Exception class
 */
export class HttpException extends Error {
  public status: number;
  public message: string;
  public errors?: any;

  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
    this.name = 'HttpException';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad Request', errors?: any): HttpException {
    return new HttpException(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): HttpException {
    return new HttpException(401, message);
  }

  static forbidden(message: string = 'Forbidden'): HttpException {
    return new HttpException(403, message);
  }

  static notFound(message: string = 'Not Found'): HttpException {
    return new HttpException(404, message);
  }

  static conflict(message: string = 'Conflict'): HttpException {
    return new HttpException(409, message);
  }

  static internalServerError(message: string = 'Internal Server Error'): HttpException {
    return new HttpException(500, message);
  }
}