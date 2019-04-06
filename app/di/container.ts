import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

import { typesConstants } from '@di/typesConstants';

import '@controllers/index';

export const createContainer = (): Container => {
    const container = new Container({ defaultScope: 'Request' });

    container.bind<string>(typesConstants.BasePath).toConstantValue('/api');

    container.load(buildProviderModule());

    return container;
};
