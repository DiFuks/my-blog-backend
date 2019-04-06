import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { LoggerService } from '@services/logger/LoggerService';
import { SystemError as SystemErr } from '@services/systemError/SystemError';

@provide(typesServices.ErrorsHandlerDefaultSystemError)
export class SystemError {
  private loggerService: LoggerService;

  constructor(
    @inject(typesServices.LoggerService) loggerService: LoggerService
  ) {
    this.loggerService = loggerService;
  }

  async handle(err: SystemErr): Promise<void> {
    await this.loggerService.notice('System error has been occurred', {
      extra: {
        systemError: {
          code: err.getSystemCode(),
          message: err.getMessage(),
          additionalData: err.getSystemAdditionalData()
        }
      }
    });
  }
}
