import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import * as stringify from 'json-stringify-safe';

import { typesServices } from '@di/typesServices';
import { LoggerService } from '@services/logger/LoggerService';

@provide(typesServices.ErrorsHandlerDefaultDefault)
export class ErrorsHandlerDefaultDefault {
    private loggerService: LoggerService;

    constructor(
        @inject(typesServices.LoggerService) loggerService: LoggerService
    ) {
        this.loggerService = loggerService;
    }

    async handle(err: Error): Promise<void> {
        await this.loggerService.critical('Unknown error has occurred', {
            extra: {
                error: stringify(err)
            }
        });
    }
}
