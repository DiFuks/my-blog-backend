import * as jwt from 'jsonwebtoken';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { typesConstants } from '@di/typesConstants';
import { User } from '@entities/User';
import { typesServices } from '@di/typesServices';
import { PayloadFactory } from '@services/jwt/PayloadFactory';

@provide(typesServices.JwtSignerService)
export class JwtSignerService {
  private readonly jwtSecretKey: string;
  private readonly payloadFactory: PayloadFactory;

  constructor(
    @inject(typesConstants.JwtSecretKey) jwtSecretKey: string,
    @inject(typesServices.JwtPayloadFactory) payloadFactory: PayloadFactory
  ) {
    this.jwtSecretKey = jwtSecretKey;
    this.payloadFactory = payloadFactory;
  }

  signUser(user: User): string {
    return jwt.sign(this.payloadFactory.create(user), this.jwtSecretKey);
  }
}
