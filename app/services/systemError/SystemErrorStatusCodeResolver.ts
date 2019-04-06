import * as httpStatusCodes from 'http-status-codes';
import { has } from 'lodash';

import { SystemErrors } from '@services/systemError/SystemError';
import { provideSingletonScope } from '@di/decorators';
import { typesServices } from '@di/typesServices';

@provideSingletonScope(typesServices.SystemErrorStatusCodeResolver)
export class SystemErrorStatusCodeResolver {
  private readonly mapping = {
    [SystemErrors.ROUTE_NOT_FOUND]: httpStatusCodes.NOT_FOUND,
    [SystemErrors.REST_VALIDATION_ERROR]: httpStatusCodes.UNPROCESSABLE_ENTITY,
    [SystemErrors.POST_NOT_FOUND]: httpStatusCodes.NOT_FOUND,
    default: httpStatusCodes.INTERNAL_SERVER_ERROR
  };

  resolve(systemErrorCode): number {
    return has(this.mapping, systemErrorCode) ? this.mapping[systemErrorCode] : this.mapping.default;
  }
}
