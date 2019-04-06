import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import * as stringify from 'json-stringify-safe';

import { IRESTErrorHandler } from '@services/errorsHandler/restHandlers/IRESTErrorHandler';
import { ErrorsHandlerDtoFactory } from '@services/errorsHandler/ErrorsHandlerDtoFactory';
import { LoggerService } from '@services/logger/LoggerService';
import { SystemErrorStatusCodeResolver } from '@services/systemError/SystemErrorStatusCodeResolver';
import { typesServices } from '@di/typesServices';
import { SystemErrors } from '@services/systemError/SystemError';

@provide(typesServices.ErrorsHandlersRequestValidationError)
export class ErrorsHandlersRequestValidationError implements IRESTErrorHandler {
  private readonly errorsHandlerDtoFactory: ErrorsHandlerDtoFactory;
  private readonly loggerService: LoggerService;
  private readonly systemErrorStatusCodeResolver: SystemErrorStatusCodeResolver;

  constructor(
    @inject(typesServices.ErrorsHandlerDtoFactory) errorsHandlerDtoFactory: ErrorsHandlerDtoFactory,
    @inject(typesServices.LoggerService) loggerService: LoggerService,
    @inject(typesServices.SystemErrorStatusCodeResolver) systemErrorStatusCodeResolver: SystemErrorStatusCodeResolver
  ) {
    this.errorsHandlerDtoFactory = errorsHandlerDtoFactory;
    this.loggerService = loggerService;
    this.systemErrorStatusCodeResolver = systemErrorStatusCodeResolver;
  }

  public handle(err: Array<ValidationError>, res: Response): void {
    const dto = this.errorsHandlerDtoFactory.create(err, SystemErrors.REST_VALIDATION_ERROR, 'Validation error');

    this.loggerService.notice('Validation error', {
      extra: {
        validationErrors: stringify(err)
      }
    });

    res.status(this.systemErrorStatusCodeResolver.resolve(SystemErrors.REST_VALIDATION_ERROR));
    res.setHeader('Content-Type', 'application/json');
    res.send(stringify(dto.normalize()));
  }
}
