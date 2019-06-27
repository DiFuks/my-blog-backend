import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import axios from 'axios';

import { typesConstants } from '@di/typesConstants';
import { typesREST } from '@di/typesREST';
import { AxiosInstanceProxy } from '@rest/AxiosInstanceProxy';
import { typesServices } from '@di/typesServices';
import { AxiosResponseLogger } from '@services/responseLogger/AxiosResponseLogger';

@provide(typesREST.BotAxiosInstance)
export class AxiosInstance extends AxiosInstanceProxy {
  constructor(
    @inject(typesConstants.BotUrl) botURL: string,
    @inject(typesServices.AxiosResponseLogger) axiosResponseLogger: AxiosResponseLogger
  ) {
    const axiosInstance = axios.create({
      baseURL: botURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    super(axiosInstance, axiosResponseLogger)
  }
}
