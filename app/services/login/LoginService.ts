import { provide } from 'inversify-binding-decorators';
import { getCustomRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { UserRepository } from '@repository/UserRepository';
import { SystemErrorFactory } from '@services/systemError/SystemErrorFactory';
import { SystemErrors } from '@services/systemError/SystemError';
import { EncryptionVerifierService } from '@services/encryption/EncryptionVerifierService';
import { JwtSignerService } from '@services/jwt/JwtSignerService';

@provide(typesServices.LoginService)
export class LoginService {
  @inject(typesServices.SystemErrorFactory)
  private readonly systemErrorFactoryService: SystemErrorFactory;

  @inject(typesServices.EncryptionVerifierService)
  private readonly encryptionVerifierService: EncryptionVerifierService;

  @inject(typesServices.JwtSignerService)
  private readonly jwtSignerService: JwtSignerService;

  public async login(email: string, password: string): Promise<string> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw this.systemErrorFactoryService.create(SystemErrors.USER_NOT_FOUND);
    }

    if (!await this.encryptionVerifierService.verifyPassword(user.password, password)) {
      throw this.systemErrorFactoryService.create(SystemErrors.USER_PASSWORD_NOT_MATCH);
    }

    return this.jwtSignerService.signUser(user);
  }
}
