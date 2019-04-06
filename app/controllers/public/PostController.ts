import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import { requestParam } from 'inversify-express-utils';

import { typesMiddlewares } from '@di/typesMiddlewares';

export const enum InitRoutes {
    ROOT = '/public/post',
}

@controller(InitRoutes.ROOT)
class PostController extends BaseHttpController{
    @httpGet('/:id', typesMiddlewares.RequestLogger)
    public async init(
      @requestParam() id
    ) {
        return this.json({
          id: id.id,
          title: "delectus aut autem",
          completed: false
        });
    }
}
