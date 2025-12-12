export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code = 'APP_ERROR', statusCode = 400, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 'BAD_REQUEST', 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class QuotaExceededError extends AppError {
  constructor(message = 'Quota exceeded') {
    super(message, 'QUOTA_EXCEEDED', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 'NOT_FOUND', 404); // Using HTTP Status Code 404
  }
}
