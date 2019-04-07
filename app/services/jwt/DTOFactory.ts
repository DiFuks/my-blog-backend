import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';
import { Token as TokenDTO } from '@dto/reponse/Token';

@provide(typesServices.JwtDTOFactory)
export class DTOFactory {
  public createByToken(token: string): TokenDTO {
    const tokenDto = new TokenDTO();

    tokenDto.token = token;

    return tokenDto;
  }
}
