import { BaseHttpController, controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { PostService } from '@services/post/PostService';
import { typesServices } from '@di/typesServices';

export const enum PostRoutes {
  ROOT = '/public/post',
  LIST = '/listByCategory/:category',
  SHORT_LIST = '/shortList',
  CATEGORIES = '/categories',
  DETAIL = '/detail/:url'
}

@controller(PostRoutes.ROOT)
class PostController extends BaseHttpController {
  private readonly postService: PostService;

  constructor(
      @inject(typesServices.PostService) postService: PostService,
  ) {
    super();

    this.postService = postService;
  }

  @httpGet(PostRoutes.LIST, typesMiddlewares.RequestLogger)
  public async getListByCategory(
      @requestParam('category') url
  ) {
    const postInfo = await this.postService.getListByCategory(url);

    return this.json(postInfo);
  }

  @httpGet(PostRoutes.SHORT_LIST, typesMiddlewares.RequestLogger)
  public async getShortList() {
    const postInfo = await this.postService.getShortList();

    return this.json(postInfo);
  }

  @httpGet(PostRoutes.CATEGORIES, typesMiddlewares.RequestLogger)
  public async getCategoryList() {
    const categoryInfo = await this.postService.getCategories();

    return this.json(categoryInfo);
  }

  @httpGet(PostRoutes.DETAIL, typesMiddlewares.RequestLogger)
  public async get(
    @requestParam('url') url
  ) {
    const postDetail = await this.postService.getByUrl(url);

    return this.json(postDetail);
  }
}
