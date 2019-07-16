import { verify } from 'argon2';
import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';

@provide(typesServices.EncryptionVerifierService)
export class EncryptionVerifierService {
  public verifyPassword(hash: string, password: string): Promise<boolean> {
    const a =3;
    return verify(hash, password);
  }
}
