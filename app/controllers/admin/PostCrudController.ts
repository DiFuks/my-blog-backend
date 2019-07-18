import {
  BaseHttpController,
  controller,
  httpGet,
  requestBody,
  httpDelete,
  queryParam,
  httpPut, httpPost,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { PostAdminService } from '@services/post/PostAdminService';
import { typesServices } from '@di/typesServices';
import { passport } from '@passport/passport';
import { AuthTypes } from '@enum/AuthTypes';
import { Post } from '@entities/Post';
import { IChangeActive } from '@dto/request/IChangeActive';

export const enum PostRoutes {
  ROOT = '/admin/post',
  LIST = '/list',
  SAVE = '/save',
  DELETE = '/delete',
  CHANGE_ACTIVE = '/changeActive',
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

  @httpPost(PostRoutes.CHANGE_ACTIVE)
  public async changeActive(
    @requestBody() body: IChangeActive,
  ) {
    await this.postAdminService.changeActive(body.id, body.isActive);

    return this.json({});
  }
}
