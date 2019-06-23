import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { ErrorsHandlerDefaultDefault } from './defaultHandlers/ErrorsHandlerDefaultDefault';
import { ErrorsHandlerNotFound as ErrorsHandlerDefaultNotFound } from '@services/errorsHandler/defaultHandlers/ErrorsHandlerNotFound';
import { SystemError as SystemErrorHandler } from '@services/errorsHandler/defaultHandlers/SystemError';
import { SystemError } from '@services/systemError/SystemError';

@provide(typesServices.ErrorsHandlerMqpService)
export class ErrorsHandlerMqpService {
    private readonly errorsHandlerDefaultDefault: ErrorsHandlerDefaultDefault;
    private readonly errorsHandlerDefaultNotFound: ErrorsHandlerDefaultNotFound;
    private readonly systemErrorHandler: SystemErrorHandler;

    constructor(
        @inject(typesServices.ErrorsHandlerDefaultDefault) errorsHandlerDefaultDefault: ErrorsHandlerDefaultDefault,
        @inject(typesServices.ErrorsHandlerDefaultNotFound) errorsHandlerDefaultNotFound: ErrorsHandlerDefaultNotFound,
        @inject(typesServices.ErrorsHandlerDefaultSystemError) systemErrorHandler: SystemErrorHandler
    ) {
        this.errorsHandlerDefaultDefault = errorsHandlerDefaultDefault;
        this.errorsHandlerDefaultNotFound = errorsHandlerDefaultNotFound;
        this.systemErrorHandler = systemErrorHandler;
    }

    async handle(err: any): Promise<void> {
        if (err.name === 'GatewaySystemError') {
            await this.systemErrorHandler.handle(err as SystemError);
        } else if (err.name === 'NotFoundError') {
            await this.errorsHandlerDefaultNotFound.handle(err as Error);
        } else {
            await this.errorsHandlerDefaultDefault.handle(err as Error);
        }
    }
}
