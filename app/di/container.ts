import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import * as winston from 'winston';
import { Connection } from 'typeorm';

import { typesConstants } from '@di/typesConstants';
import { winstonLogger } from '@logger/winston';
import { AppEnvironment } from '@enum/AppEnvironment';

import '@controllers/index';
import '@middlewares/index';
import '@services/index';

export const createContainer = (connection: Connection): Container => {
    const container = new Container({ defaultScope: 'Request' });

    container.bind<AppEnvironment>(typesConstants.NodeEnv).toConstantValue(process.env.NODE_ENV as AppEnvironment);

    container.bind<string>(typesConstants.BasePath).toConstantValue('/api');
    container.bind<winston.Logger>(typesConstants.WinstonLogger).toConstantValue(winstonLogger);
    container.bind<Connection>(typesConstants.DBConnection).toConstantValue(connection);

    container.bind<string>(typesConstants.RedisHost).toConstantValue(process.env.REDIS_HOST);
    container.bind<string>(typesConstants.RedisPort).toConstantValue(process.env.REDIS_PORT);

    container.load(buildProviderModule());

    return container;
};
