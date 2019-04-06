import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';

import { typesMiddlewares } from '@di/typesMiddlewares';

export const enum InitRoutes {
    ROOT = '/public/post',
}

@controller(InitRoutes.ROOT)
class PostController extends BaseHttpController{
    @httpGet('/', typesMiddlewares.RequestLogger)
    public async init() {
        return this.json({});
    }
}
