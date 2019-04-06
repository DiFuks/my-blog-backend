import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { AppEnvironment } from '@enum/AppEnvironment';
import { typesServices } from '@di/typesServices';
import { typesConstants } from '@di/typesConstants';
import { Error } from '@dto/errorResponse/Error';
import { SystemErrors } from '@services/systemError/SystemError';

@provide(typesServices.ErrorsHandlerDtoFactory)
export class ErrorsHandlerDtoFactory {
  private readonly nodeEnv: AppEnvironment;

  constructor(
    @inject(typesConstants.NodeEnv) nodeEnv: AppEnvironment
  ) {
    this.nodeEnv = nodeEnv;
  }

  create(err: any, code: SystemErrors, message: string = '', data: object = {}) {
    const dto = new Error();

    dto
      .setCode(code)
      .setError(err)
    ;

    if (this.nodeEnv === AppEnvironment.DEVELOPMENT) {
      dto
        .setData(data)
        .setMessage(message)
      ;
    }

    return dto;
  }
}
