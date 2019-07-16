import {
  BaseHttpController,
  controller,
  httpGet,
} from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { typesServices } from '@di/typesServices';
import { passport } from '@passport/passport';
import { AuthTypes } from '@enum/AuthTypes';
import { CategoryAdminService } from '@services/post/CategoryAdminService';

export const enum CategoryRoutes {
  ROOT = '/admin/category',
  LIST = '/list',
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
}
