import { BaseHttpController, controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { LoginService } from '@services/login/LoginService';
import { DTOFactory as JwtDTOFactory } from '@services/jwt/DTOFactory';
import { typesServices } from '@di/typesServices';

export const enum AccountRoutes {
  ROOT = '/admin/account',
  LOGIN = '/login'
}

@controller(AccountRoutes.ROOT, typesMiddlewares.RequestLogger)
class AccountController extends BaseHttpController {
  @inject(typesServices.LoginService)
  private readonly loginService: LoginService;

  @inject(typesServices.JwtDTOFactory)
  private readonly jwtDTOFactory: JwtDTOFactory;

  @httpPost(AccountRoutes.LOGIN)
  public async login(
    @requestBody() requestBody
  ) {
    const token = await this.loginService.login(requestBody.login, requestBody.password);

    return this.json(this.jwtDTOFactory.createByToken(token));
  }
}
