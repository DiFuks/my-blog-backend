import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { IProcessor } from '@services/mqMessage/IProcessor';
import { LoggerService } from '@services/logger/LoggerService';
import { Dto } from "@services/mqMessage/botRequestCallback/Dto";

@provide(typesServices.MqMessageBotRequestCallbackProcessor)
export class Processor implements IProcessor {
    private readonly loggerService: LoggerService;

    constructor(
        @inject(typesServices.LoggerService) loggerService: LoggerService,
    ) {
        this.loggerService = loggerService;
    }

    async process(data: Dto): Promise<void> {
        console.log(data);

        await Promise.all([
            this.loggerService.info('Found user by the provided application ID', {
                extra: data
            }),
        ]);
    }
}
