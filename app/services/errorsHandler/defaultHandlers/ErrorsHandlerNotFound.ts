import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import * as stringify from 'json-stringify-safe';

import { typesServices } from '@di/typesServices';
import { LoggerService } from '@services/logger/LoggerService';
import { IRESTErrorHandler } from '@services/errorsHandler/restHandlers/IRESTErrorHandler';

@provide(typesServices.ErrorsHandlerDefaultNotFound)
export class ErrorsHandlerNotFound {
    private readonly loggerService: LoggerService;

    constructor(
        @inject(typesServices.LoggerService) loggerService: LoggerService
    ) {
        this.loggerService = loggerService;
    }

    public async handle(err: Error): Promise<void> {
        await this.loggerService.notice('Not found', {
            extra: {
                error: stringify(err)
            }
        });
    }
}
