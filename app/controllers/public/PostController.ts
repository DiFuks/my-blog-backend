import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { inject } from 'inversify';
import { typesServices } from '@di/typesServices';
import { SystemErrorFactory } from '@services/systemError/SystemErrorFactory';
import { SystemErrors } from '@services/systemError/SystemError';

export const enum InitRoutes {
    ROOT = '/public/post',
}

@controller(InitRoutes.ROOT)
class PostController extends BaseHttpController{
    private readonly systemErrorFactory: SystemErrorFactory;

    constructor(
      @inject(typesServices.SystemErrorFactory) systemErrorFactory,
    ) {
        super();

        this.systemErrorFactory = systemErrorFactory;
    }

    @httpGet('/', typesMiddlewares.RequestLogger)
    public async init() {
        throw this.systemErrorFactory.create(SystemErrors.OTHER);

        return this.json({});
    }
}
