import { CustomError } from 'ts-custom-error';

export const enum SystemErrors {
  MQ_MESSAGE_UNKNOWN_TYPE = 30,
  REST_VALIDATION_ERROR = 200,
  POST_NOT_FOUND = 300,
  USER_NOT_FOUND = 400,
  USER_PASSWORD_NOT_MATCH = 401,
  REMOTE_REQUEST_UNHANDLED_ERROR = 999,
  OTHER = 1000,
  ROUTE_NOT_FOUND = 1001,
}

export class SystemError extends CustomError {
  private systemCode: SystemErrors;
  private systemAdditionalData: object;

  constructor(message?: string) {
    super(message);

    this.name = 'SystemError';

    Error.captureStackTrace(this, SystemError);
  }

  public getSystemCode(): SystemErrors {
    return this.systemCode;
  }

  public setSystemCode(systemCode: SystemErrors) {
    this.systemCode = systemCode;
  }

  public getMessage(): string {
    return this.message;
  }

  public getSystemAdditionalData(): object {
    return this.systemAdditionalData;
  }

  public setSystemAdditionalData(systemAdditionalData: object) {
    this.systemAdditionalData = systemAdditionalData;
  }
}
