import { Response } from 'express';
import { provide } from 'inversify-binding-decorators';
import * as stringify from 'json-stringify-safe';
import * as httpStatusCodes from 'http-status-codes';
import { inject } from 'inversify';

import { ErrorsHandlerDtoFactory } from '@services/errorsHandler/ErrorsHandlerDtoFactory';
import { SystemError, SystemErrors } from '@services/systemError/SystemError';
import { LoggerService } from '@services/logger/LoggerService';
import { ErrorsHandlerDefaultDefault } from '@services/errorsHandler/defaultHandlers/ErrorsHandlerDefaultDefault';
import { typesServices } from '@di/typesServices';
import { IRESTErrorHandler } from '@services/errorsHandler/restHandlers/IRESTErrorHandler';

@provide(typesServices.ErrorsHandlerDefault)
export class ErrorsHandlerDefault implements IRESTErrorHandler {
  private errorsHandlerDtoFactory: ErrorsHandlerDtoFactory;
  private loggerService: LoggerService;
  private errorsHandlerDefaultDefault: ErrorsHandlerDefaultDefault;

  constructor(
    @inject(typesServices.ErrorsHandlerDtoFactory) errorsHandlerDtoFactory: ErrorsHandlerDtoFactory,
    @inject(typesServices.LoggerService) loggerService: LoggerService,
    @inject(typesServices.ErrorsHandlerDefaultDefault) errorsHandlerDefaultDefault: ErrorsHandlerDefaultDefault
  ) {
    this.errorsHandlerDtoFactory = errorsHandlerDtoFactory;
    this.loggerService = loggerService;
    this.errorsHandlerDefaultDefault = errorsHandlerDefaultDefault;
  }

  public async handle(err: SystemError, res: Response): Promise<void> {
    await this.errorsHandlerDefaultDefault.handle(err);

    const dto = this.errorsHandlerDtoFactory.create(err, SystemErrors.OTHER, 'Internal error');

    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR);
    res.setHeader('Content-Type', 'application/json');
    res.send(stringify(dto.normalize()));
  }
}
