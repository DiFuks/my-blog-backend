import { Request, Response } from 'express';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { ValidationError } from 'class-validator';
import { has } from 'lodash';

import { typesServices } from '@di/typesServices';
import { ErrorsHandlerDefault } from '@services/errorsHandler/restHandlers/ErrorsHandlerDefault';
import { AppEnvironment } from '@enum/AppEnvironment';
import { SystemError } from '@services/systemError/SystemError';
import { ErrorsHandlerNotFound } from '@services/errorsHandler/restHandlers/ErrorsHandlerNotFound';
import { ErrorsHandlersRequestValidationError } from '@services/errorsHandler/restHandlers/ErrorsHandlersRequestValidationError';
import { SystemError as SystemErrorHandler } from '@services/errorsHandler/restHandlers/ErrorsHandlerSystemError';

@provide(typesServices.ErrorsHandlerService)
export class ErrorsHandlerService {
  private readonly errorsHandlerDefault: ErrorsHandlerDefault;
  private readonly errorsHandlerNotFound: ErrorsHandlerNotFound;
  private readonly errorsHandlersRequestValidationError: ErrorsHandlersRequestValidationError;
  private readonly systemErrorHandler: SystemErrorHandler;

  constructor(
    @inject(typesServices.ErrorsHandlerDefault) errorsHandlerDefault: ErrorsHandlerDefault,
    @inject(typesServices.ErrorsHandlerNotFound) errorsHandlerNotFound: ErrorsHandlerNotFound,
    @inject(typesServices.ErrorsHandlersRequestValidationError) errorsHandlersRequestValidationError: ErrorsHandlersRequestValidationError,
    @inject(typesServices.ErrorsHandlerSystemError) systemErrorHandler: SystemErrorHandler
  ) {
    this.errorsHandlerDefault = errorsHandlerDefault;
    this.errorsHandlerNotFound = errorsHandlerNotFound;
    this.errorsHandlersRequestValidationError = errorsHandlersRequestValidationError;
    this.systemErrorHandler = systemErrorHandler;
  }

  public async handle(err: any, req: Request, res: Response): Promise<void> {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === AppEnvironment.DEVELOPMENT ? err : {};

    if (err.name === 'SystemError') {
      await this.systemErrorHandler.handle(err as SystemError, res);
    } else if (err.name === 'NotFoundError') {
      await this.errorsHandlerNotFound.handle(err as Error, res);
    } else if (err instanceof Array && err[0] instanceof ValidationError) {
      await this.errorsHandlersRequestValidationError.handle(err as Array<ValidationError>, res);
    } else {
      await this.errorsHandlerDefault.handle(err as SystemError, res);
    }
  }
}
