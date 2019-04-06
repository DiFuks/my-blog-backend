import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import * as winston from 'winston';

import { typesConstants } from '@di/typesConstants';
import { winstonLogger } from '@logger/winston';
import { AppEnvironment } from '@enum/AppEnvironment';

import '@controllers/index';
import '@middlewares/index';
import '@services/index';

export const createContainer = (): Container => {
    const container = new Container({ defaultScope: 'Request' });

    container.bind<AppEnvironment>(typesConstants.NodeEnv).toConstantValue(process.env.NODE_ENV as AppEnvironment);

    container.bind<string>(typesConstants.BasePath).toConstantValue('/api');
    container.bind<winston.Logger>(typesConstants.WinstonLogger).toConstantValue(winstonLogger);

    container.load(buildProviderModule());

    return container;
};
