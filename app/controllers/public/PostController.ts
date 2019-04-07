import { BaseHttpController, controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { PostService } from '@services/post/PostService';
import { typesServices } from '@di/typesServices';

export const enum PostRoutes {
  ROOT = '/public/post',
  LIST = '/list',
  DETAIL = '/detail/:url'
}

@controller(PostRoutes.ROOT)
class PostController extends BaseHttpController {
  @inject(typesServices.PostService)
  private readonly postService: PostService;

  @httpGet(PostRoutes.LIST, typesMiddlewares.RequestLogger)
  public async getList() {
    const postInfo = await this.postService.getList();

    return this.json(postInfo);
  }

  @httpGet(PostRoutes.DETAIL, typesMiddlewares.RequestLogger)
  public async get(
    @requestParam('url') url
  ) {
    const postDetail = await this.postService.getByUrl(url);

    return this.json(postDetail);
  }
}
