import { fluentProvide } from 'inversify-binding-decorators';
import { interfaces as inversifyInterfaces } from 'inversify';

export const provideSingletonScope = function(serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>) {
    return fluentProvide(serviceIdentifier)
        .inSingletonScope()
        .done();
};
