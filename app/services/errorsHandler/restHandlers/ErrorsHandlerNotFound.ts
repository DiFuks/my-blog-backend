import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import * as stringify from 'json-stringify-safe';

import { typesServices } from '@di/typesServices';
import { SystemErrors } from '@services/systemError/SystemError';
import { ErrorsHandlerDtoFactory } from '@services/errorsHandler/ErrorsHandlerDtoFactory';
import { SystemErrorStatusCodeResolver } from '@services/systemError/SystemErrorStatusCodeResolver';
import { Response } from 'express';
import { IRESTErrorHandler } from '@services/errorsHandler/restHandlers/IRESTErrorHandler';
import { ErrorsHandlerNotFound as ErrorsHandlerDefaultNotFound } from '@services/errorsHandler/defaultHandlers/ErrorsHandlerNotFound';

@provide(typesServices.ErrorsHandlerNotFound)
export class ErrorsHandlerNotFound implements IRESTErrorHandler {
  private readonly errorsHandlerDefaultNotFound: ErrorsHandlerDefaultNotFound;
  private readonly errorsHandlerDtoFactory: ErrorsHandlerDtoFactory;
  private readonly systemErrorStatusCodeResolver: SystemErrorStatusCodeResolver;

  constructor(
    @inject(typesServices.ErrorsHandlerDefaultNotFound) errorsHandlerDefaultNotFound: ErrorsHandlerDefaultNotFound,
    @inject(typesServices.ErrorsHandlerDtoFactory) errorsHandlerDtoFactory: ErrorsHandlerDtoFactory,
    @inject(typesServices.SystemErrorStatusCodeResolver) systemErrorStatusCodeResolver: SystemErrorStatusCodeResolver
  ) {
    this.errorsHandlerDefaultNotFound = errorsHandlerDefaultNotFound;
    this.errorsHandlerDtoFactory = errorsHandlerDtoFactory;
    this.systemErrorStatusCodeResolver = systemErrorStatusCodeResolver;
  }

  public async handle(err: Error, res: Response): Promise<void> {
    await this.errorsHandlerDefaultNotFound.handle(err);

    const dto = this.errorsHandlerDtoFactory.create(err, SystemErrors.ROUTE_NOT_FOUND, 'Not found');

    res.status(this.systemErrorStatusCodeResolver.resolve(SystemErrors.ROUTE_NOT_FOUND));
    res.setHeader('Content-Type', 'application/json');
    res.send(stringify(dto.normalize()));
  }
}
