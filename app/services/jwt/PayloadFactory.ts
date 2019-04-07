import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';
import { User } from '@entities/User';
import { IJwtPayload } from '@dto/core/IJwtPayload';

@provide(typesServices.JwtPayloadFactory)
export class PayloadFactory {
  public create(user: User): IJwtPayload {
    return {
      id: user.id
    };
  }
}
