import { SystemError, SystemErrors } from '@services/systemError/SystemError';
import { provideSingletonScope } from '@di/decorators';
import { typesServices } from '@di/typesServices';

@provideSingletonScope(typesServices.SystemErrorFactory)
export class SystemErrorFactory {
  public create(systemErrorCode: SystemErrors, message: string = '', data: object = {}): SystemError {
    const systemError = new SystemError(message);

    systemError.setSystemCode(systemErrorCode);
    systemError.setSystemAdditionalData(data);

    return systemError;
  }
}
