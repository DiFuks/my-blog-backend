import {
  BaseHttpController,
  controller,
  httpGet,
  requestBody,
  httpDelete,
  queryParam,
  httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { PostAdminService } from '@services/post/PostAdminService';
import { typesServices } from '@di/typesServices';
import { passport } from '@passport/passport';
import { AuthTypes } from '@enum/AuthTypes';
import { Post } from '@entities/Post';

export const enum PostRoutes {
  ROOT = '/admin/post',
  LIST = '/list',
  SAVE = '/save',
  DELETE = '/delete',
}

@controller(PostRoutes.ROOT, passport.authenticate([AuthTypes.JWT], {session: false}), typesMiddlewares.RequestLogger)
class PostCrudController extends BaseHttpController {
  @inject(typesServices.PostAdminService)
  private readonly postAdminService: PostAdminService;

  @httpGet(PostRoutes.LIST)
  public async getList() {
    const posts = await this.postAdminService.getAll();

    return this.json(posts);
  }

  @httpPut(PostRoutes.SAVE)
  public async save(
    @requestBody() post: Post,
  ) {
    await this.postAdminService.save(post);

    return this.json({});
  }

  @httpDelete(PostRoutes.DELETE)
  public async delete(
    @queryParam('id') id: string,
  ) {
    await this.postAdminService.delete(id);

    return this.json({});
  }
}
