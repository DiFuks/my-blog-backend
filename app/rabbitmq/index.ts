import * as amqp from 'amqp-connection-manager';
import { Container } from 'inversify';
import delay from 'delay';
import { Channel, Message } from 'amqplib';

import { typesServices } from '@di/typesServices';
import { LoggerChannelEnum, LoggerService } from '@services/logger/LoggerService';
import { ErrorsHandlerMqpService } from '@services/errorsHandler/ErrorsHandlerMqpService';
import { Processor } from '@services/mqMessage/Processor';

const connection = amqp.connect([
    `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}`
]);

export const init = (baseContainer: Container) => {
    connection.createChannel({
        json: true,
        setup: async (channel: Channel) => {
            const consume = async () => {
                await delay(5000);

                const { consumerTag } = await channel.consume(process.env.AMQP_QUEUE_NAME, async (msg: Message) => {
                    const container = baseContainer.createChild({
                        defaultScope: 'Request'
                    });

                    const loggerService = container.get<LoggerService>(typesServices.LoggerService);

                    loggerService.setDefaultChannel(LoggerChannelEnum.MQP);

                    if (msg === null) {
                        await Promise.all([
                            loggerService.warning('Null message cas come. Cancelling consumer and trying to reconnect.', {
                                extra: {
                                    consumerTag: consumerTag
                                }
                            }),
                            channel.cancel(consumerTag)
                        ]);

                        return consume();
                    }

                    const messageContent = msg.content.toString();

                    await loggerService.info('New message has come', {
                        extra: {
                            messageContent: messageContent
                        }
                    });

                    let content;

                    try {
                        content = JSON.parse(messageContent);
                    } catch (e) {
                        await loggerService.error("Message isn't JSON", {
                            extra: {
                                messageContent: messageContent
                            }
                        });

                        channel.ack(msg);

                        await loggerService.info('Acknowledged the message');

                        return;
                    }

                    const mqMessageProcessorService = container.get<Processor>(typesServices.MqMessageProcessor);

                    try {
                        await mqMessageProcessorService.process(content);
                    } catch (err) {
                        const errorsHandlerMqpService = container.get<ErrorsHandlerMqpService>(typesServices.ErrorsHandlerMqpService);

                        errorsHandlerMqpService.handle(err);
                    }

                    channel.ack(msg);

                    await loggerService.info('Acknowledged the message');
                });
            };

            await Promise.all([
                channel.prefetch(1),
                consume(),
            ]);
        }
    });
};
