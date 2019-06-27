import { AxiosResponse } from 'axios';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';
import { RequestStatistics } from '@entities/RequestStatistics';
import { SessionIdService } from '@services/session/SessionIdService';

@provide(typesServices.AxiosResponseLogger)
export class AxiosResponseLogger {
  private sessionIdService: SessionIdService;

  constructor(
    @inject(typesServices.SessionIdService) sessionIdService: SessionIdService
  ) {
    this.sessionIdService = sessionIdService;
  }

  public saveAxiosResponse(axiosResponse: any): Promise<RequestStatistics> {
    const requestStatistic = new RequestStatistics();

    axiosResponse = axiosResponse as AxiosResponse;

    requestStatistic.sessionId = this.sessionIdService.getId();
    requestStatistic.url = axiosResponse.config.url;
    requestStatistic.requestBody = axiosResponse.config.data;
    requestStatistic.requestHeaders = axiosResponse.config.headers;
    requestStatistic.requestMethod = axiosResponse.config.method;
    requestStatistic.responseBody = axiosResponse.data;
    requestStatistic.responseCode = axiosResponse.status;
    requestStatistic.responseHeaders = axiosResponse.headers;

    const requestRequestStatistics = getRepository(RequestStatistics);

    return requestRequestStatistics.save(requestStatistic);
  }
}
