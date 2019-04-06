import { provide } from 'inversify-binding-decorators';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { inject } from 'inversify';
import * as httpStatusCodes from 'http-status-codes';
import * as stringify from 'json-stringify-safe';

import { typesServices } from '@di/typesServices';
import { UnhandledRemoteError as DefaultUnhandledRemoteError } from '@services/errorsHandler/defaultHandlers/UnhandledRemoteError';
import { ErrorsHandlerDtoFactory } from '@services/errorsHandler/ErrorsHandlerDtoFactory';
import { SystemErrors } from '@services/systemError/SystemError';

@provide(typesServices.ErrorsHandlerUnhandledRemoteError)
export class UnhandledRemoteError {
    private readonly defaultUnhandledRemoteError: DefaultUnhandledRemoteError;
    private readonly errorsHandlerDtoFactory: ErrorsHandlerDtoFactory;

    constructor(
        @inject(typesServices.ErrorsHandlerDefaultUnhandledRemoteError) defaultUnhandledRemoteError: DefaultUnhandledRemoteError,
        @inject(typesServices.ErrorsHandlerDtoFactory) errorsHandlerDtoFactory: ErrorsHandlerDtoFactory
    ) {
        this.defaultUnhandledRemoteError = defaultUnhandledRemoteError;
        this.errorsHandlerDtoFactory = errorsHandlerDtoFactory;
    }

    async handle(err: AxiosError, res: Response): Promise<void> {
        await this.defaultUnhandledRemoteError.handle(err);

        const dto = this.errorsHandlerDtoFactory.create(
            err,
            SystemErrors.REMOTE_REQUEST_UNHANDLED_ERROR,
            'Unhandled error has occurred while requesting remote server',
            {
                url: err.config.url,
                requestBody: err.config.data,
                requestHeaders: err.config.headers,
                responseBody: err.response.data,
                responseCode: err.response.status,
                responseHeaders: err.response.headers,
                method: err.config.method
            }
        );

        res.setHeader('Content-Type', 'application/json');

        res
            .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
            .send(stringify(dto.normalize()))
        ;
    }
}
