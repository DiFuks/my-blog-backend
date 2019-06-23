import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { Processor as BotRequestCallbackProcessor } from '@services/mqMessage/botRequestCallback/Processor';

@provide(typesServices.MqMessageProcessor)
export class Processor {
    private readonly botRequestCallbackProcessor: BotRequestCallbackProcessor;

    constructor(
        @inject(typesServices.MqMessageBotRequestCallbackProcessor) botRequestCallbackProcessor: BotRequestCallbackProcessor
    ) {
        this.botRequestCallbackProcessor = botRequestCallbackProcessor;
    }

    async process(data: any): Promise<void> {
        await this.botRequestCallbackProcessor.process(data);
    }
}
