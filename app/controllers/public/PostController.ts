import { BaseHttpController, controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { PostService } from '@services/post/PostService';
import { typesServices } from '@di/typesServices';

export const enum InitRoutes {
    ROOT = '/public/post',
}

@controller(InitRoutes.ROOT)
class PostController extends BaseHttpController {
  @inject(typesServices.PostService)
  private readonly postService: PostService;

  @httpGet('/list', typesMiddlewares.RequestLogger)
  public async getList() {
    const postInfo = await this.postService.getList();

    return this.json(postInfo);
  }

  @httpGet('/detail/:url', typesMiddlewares.RequestLogger)
  public async get(
    @requestParam('url') url
  ) {
    const postDetail = await this.postService.getByUrl(url);

    return this.json(postDetail);
  }
}
