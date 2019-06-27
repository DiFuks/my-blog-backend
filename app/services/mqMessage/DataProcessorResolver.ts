import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { SystemErrorFactory } from '@services/systemError/SystemErrorFactory';
import { Processor as BotRequestCallbackProcessor } from '@services/mqMessage/botRequestCallback/Processor';
import { RabbitTypes } from '@enum/RabbitTypes';
import { IProcessor } from '@services/mqMessage/IProcessor';
import { SystemErrors } from '@services/systemError/SystemError';

@provide(typesServices.MqMessageDataProcessorResolver)
export class DataProcessorResolver {
    private readonly systemErrorFactory: SystemErrorFactory;
    private readonly mapping: {[key in RabbitTypes]: IProcessor};

    constructor(
        @inject(typesServices.SystemErrorFactory) systemErrorFactory: SystemErrorFactory,
        @inject(typesServices.MqMessageBotRequestCallbackProcessor) botRequestCallbackProcessor: BotRequestCallbackProcessor
    ) {
        this.systemErrorFactory = systemErrorFactory;

        this.mapping = {
            [RabbitTypes.BOT_RESPONSE]: botRequestCallbackProcessor,
        }
    }

    resolve(type: RabbitTypes): IProcessor {
        if (this.mapping[type]) {
            return this.mapping[type];
        }

        throw this.systemErrorFactory.create(
            SystemErrors.MQ_MESSAGE_UNKNOWN_TYPE,
            'Cannot resolve mq message processor: unknown message type has come',
            {
                type: type
            }
        );
    }

}
