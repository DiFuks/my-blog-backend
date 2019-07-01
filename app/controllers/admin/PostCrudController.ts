import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { PostService } from '@services/post/PostService';
import { typesServices } from '@di/typesServices';
import { passport } from '@passport/passport';
import { AuthTypes } from '@enum/AuthTypes';

export const enum PostRoutes {
  ROOT = '/admin/post',
  LIST = '/list',
}

@controller(PostRoutes.ROOT, passport.authenticate([AuthTypes.JWT], {session: false}), typesMiddlewares.RequestLogger)
class PostCrudController extends BaseHttpController {
  @inject(typesServices.PostService)
  private readonly postService: PostService;

  @httpGet(PostRoutes.LIST)
  public async getList() {
    const posts = await this.postService.getAll();

    return this.json(posts);
  }
}
