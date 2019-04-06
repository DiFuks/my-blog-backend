import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { AxiosError } from 'axios';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { SessionIdService } from '@services/session/SessionIdService';
import { LoggerService } from '@services/logger/LoggerService';
import { RequestStatistics } from '@entities/RequestStatistics';

@provide(typesServices.ErrorsHandlerDefaultUnhandledRemoteError)
export class UnhandledRemoteError {
    private readonly loggerService: LoggerService;
    private readonly sessionIdService: SessionIdService;

    constructor(
        @inject(typesServices.LoggerService) loggerService: LoggerService,
        @inject(typesServices.SessionIdService) sessionIdService: SessionIdService
    ) {
        this.loggerService = loggerService;
        this.sessionIdService = sessionIdService;
    }

    async handle(err: AxiosError): Promise<void> {
        const requestStatisticsRepository = getRepository(RequestStatistics);

        const requestStatistics = requestStatisticsRepository.create({
            url: err.config.url,
            sessionId: this.sessionIdService.getId(),
            requestBody: err.config.data,
            requestHeaders: err.config.headers,
            responseBody: err.response.data,
            responseCode: err.response.status,
            responseHeaders: err.response.headers
        });

        await Promise.all([
            requestStatisticsRepository.save(requestStatistics),
            this.loggerService.critical('Something bad happened in the remote server!')
        ]);
    }
}
