import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { AxiosResponse } from 'axios';

import { typesREST } from '@di/typesREST';
import { AxiosInstance } from './AxiosInstance';
import { IChatRequest } from '@dto/request/IChatRequest';

export const enum Endpoints {
    SEND = '/bot/send',
}

@provide(typesREST.BotRESTWorker)
export class RestWorker {
    private readonly botAxiosInstance: AxiosInstance;

    constructor(
        @inject(typesREST.BotAxiosInstance) botAxiosInstance: AxiosInstance,
    ) {
        this.botAxiosInstance = botAxiosInstance;
    }

    public send(chatRequest: IChatRequest): Promise<AxiosResponse> {
        return this.botAxiosInstance.post(Endpoints.SEND, chatRequest);
    }
}
