import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';

export const enum InitRoutes {
    ROOT = '/public/post',
}

@controller(InitRoutes.ROOT)
class PostController extends BaseHttpController{
    @httpGet('/')
    public async init() {
        return this.json({});
    }
}
