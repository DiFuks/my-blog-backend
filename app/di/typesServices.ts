export const typesServices = {
  LoggerService: Symbol.for('LoggerService'),
  SessionIdService: Symbol.for('SessionIdService'),
  RedisCache: Symbol.for('RedisCache'),

  SystemErrorFactory: Symbol.for('SystemErrorFactory'),
  SystemErrorStatusCodeResolver: Symbol.for('SystemErrorStatusCodeResolver'),

  ErrorsHandlerDtoFactory: Symbol.for('ErrorsHandlerDtoFactory'),
  ErrorsHandlerDefaultDefault: Symbol.for('ErrorsHandlerDefaultDefault'),
  ErrorsHandlerDefault: Symbol.for('ErrorsHandlerDefault'),
  ErrorsHandlerService: Symbol.for('ErrorsHandlerService'),
  ErrorsHandlerNotFound: Symbol.for('ErrorsHandlerNotFound'),
  ErrorsHandlersRequestValidationError: Symbol.for('ErrorsHandlersRequestValidationError'),
  ErrorsHandlerDefaultNotFound: Symbol.for('ErrorsHandlerDefaultNotFound'),
  ErrorsHandlerDefaultSystemError: Symbol.for('ErrorsHandlerDefaultSystemError'),
  ErrorsHandlerSystemError: Symbol.for('ErrorsHandlerSystemError'),

  PostInfoDtoFactory: Symbol.for('PostInfoDtoFactory'),
  PostDetailDtoFactory: Symbol.for('PostDetailDtoFactory'),
  PostService: Symbol.for('PostService'),

  LoginService: Symbol.for('LoginService'),

  EncryptionVerifierService: Symbol.for('EncryptionVerifierService'),

  JwtSignerService: Symbol.for('JwtSignerService'),
  JwtDTOFactory: Symbol.for('JwtDTOFactory'),
  JwtPayloadFactory: Symbol.for('JwtPayloadFactory'),
};
