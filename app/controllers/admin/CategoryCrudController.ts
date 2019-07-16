import {
  BaseHttpController,
  controller, httpDelete,
  httpGet, httpPut, queryParam, requestBody,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { typesServices } from '@di/typesServices';
import { passport } from '@passport/passport';
import { AuthTypes } from '@enum/AuthTypes';
import { CategoryAdminService } from '@services/post/CategoryAdminService';
import { Category } from '@entities/Category';

export const enum CategoryRoutes {
  ROOT = '/admin/category',
  LIST = '/list',
  SAVE = '/save',
  DELETE = '/delete',
}

@controller(CategoryRoutes.ROOT, passport.authenticate([AuthTypes.JWT], {session: false}), typesMiddlewares.RequestLogger)
class CategoryCrudController extends BaseHttpController {
  @inject(typesServices.CategoryAdminService)
  private readonly categoryAdminService: CategoryAdminService;

  @httpGet(CategoryRoutes.LIST)
  public async getList() {
    const categories = await this.categoryAdminService.getAll();

    return this.json(categories);
  }

  @httpPut(CategoryRoutes.SAVE)
  public async save(
    @requestBody() category: Category,
  ) {
    await this.categoryAdminService.save(category);

    return this.json({});
  }

  @httpDelete(CategoryRoutes.DELETE)
  public async delete(
    @queryParam('id') id: string,
  ) {
    await this.categoryAdminService.delete(id);

    return this.json({});
  }
}
