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
  ErrorsHandlerMqpService: Symbol.for('ErrorsHandlerMqpService'),
  ErrorsHandlerUnhandledRemoteError: Symbol.for('ErrorsHandlerUnhandledRemoteError'),
  ErrorsHandlerDefaultUnhandledRemoteError: Symbol.for('ErrorsHandlerDefaultUnhandledRemoteError'),

  PostDtoFactory: Symbol.for('PostDtoFactory'),
  PostService: Symbol.for('PostService'),
  CategoryDtoFactory: Symbol.for('CategoryDtoFactory'),

  LoginService: Symbol.for('LoginService'),

  EncryptionVerifierService: Symbol.for('EncryptionVerifierService'),

  JwtSignerService: Symbol.for('JwtSignerService'),
  JwtDTOFactory: Symbol.for('JwtDTOFactory'),
  JwtPayloadFactory: Symbol.for('JwtPayloadFactory'),

  MqMessageProcessor: Symbol.for('MqMessageProcessor'),
  MqMessageDataProcessorResolver: Symbol.for('MqMessageDataProcessorResolver'),
  MqMessageBotRequestCallbackProcessor: Symbol.for('MqMessageBotRequestCallbackProcessor'),

  ChatSenderService: Symbol.for('ChatSenderService'),
  ChatService: Symbol.for('ChatService'),

  AxiosResponseLogger: Symbol.for('AxiosResponseLogger'),


  SocketUserConnectionManager: Symbol.for('SocketUserConnectionManager'),
  SocketMessageSender: Symbol.for('SocketMessageSender'),
};
