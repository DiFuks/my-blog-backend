import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { SystemError as DefaultSystemErrorHandler } from '@services/errorsHandler/defaultHandlers/SystemError';
import { SystemError as SystemErr } from '@services/systemError/SystemError';
import { SystemErrorStatusCodeResolver } from '@services/systemError/SystemErrorStatusCodeResolver';
import { ErrorsHandlerDtoFactory } from '@services/errorsHandler/ErrorsHandlerDtoFactory';
import { Response } from 'express';

@provide(typesServices.ErrorsHandlerSystemError)
export class SystemError {
  private readonly defaultSystemErrorHandler: DefaultSystemErrorHandler;
  private readonly systemErrorStatusCodeResolver: SystemErrorStatusCodeResolver;
  private readonly errorsHandlerDtoFactory: ErrorsHandlerDtoFactory;

  constructor(
    @inject(typesServices.ErrorsHandlerDefaultSystemError) defaultSystemErrorHandler: DefaultSystemErrorHandler,
    @inject(typesServices.SystemErrorStatusCodeResolver) systemErrorStatusCodeResolver: SystemErrorStatusCodeResolver,
    @inject(typesServices.ErrorsHandlerDtoFactory) errorsHandlerDtoFactory: ErrorsHandlerDtoFactory,
  ) {
    this.defaultSystemErrorHandler = defaultSystemErrorHandler;
    this.systemErrorStatusCodeResolver = systemErrorStatusCodeResolver;
    this.errorsHandlerDtoFactory = errorsHandlerDtoFactory;
  }

  /**
   * @param {SystemError} err
   * @param {Response} res
   */
  async handle(err: SystemErr, res: Response): Promise<void> {
    await this.defaultSystemErrorHandler.handle(err);

    res.status(this.systemErrorStatusCodeResolver.resolve(err.getSystemCode()));
    res.json(
      this.errorsHandlerDtoFactory.create(
        err,
        err.getSystemCode(),
        err.getMessage(),
        err.getSystemAdditionalData()
      ).normalize()
    );
  }
}
