import * as amqp from 'amqp-connection-manager';

export const connection = amqp.connect([
    `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}`
]);
