export const typesServices = {
    LoggerService: Symbol.for('LoggerService'),
    SessionIdService: Symbol.for('SessionIdService'),

    SystemErrorFactory: Symbol.for('SystemErrorFactory'),
    SystemErrorStatusCodeResolver: Symbol.for('SystemErrorStatusCodeResolver'),

    ErrorsHandlerDtoFactory: Symbol.for('ErrorsHandlerDtoFactory'),
    ErrorsHandlerDefaultDefault: Symbol.for('ErrorsHandlerDefaultDefault'),
    ErrorsHandlerDefault: Symbol.for('ErrorsHandlerDefault'),
    ErrorsHandlerService: Symbol.for('ErrorsHandlerService'),
    ErrorsHandlerNotFound: Symbol.for('ErrorsHandlerNotFound'),
    ErrorsHandlersRequestValidationError: Symbol.for('ErrorsHandlersRequestValidationError'),
    ErrorsHandlerDefaultNotFound: Symbol.for('ErrorsHandlerDefaultNotFound'),
    ErrorsHandlerDefaultUnhandledRemoteError:  Symbol.for('ErrorsHandlerDefaultUnhandledRemoteError'),
    ErrorsHandlerUnhandledRemoteError: Symbol.for('ErrorsHandlerUnhandledRemoteError'),
    ErrorsHandlerDefaultSystemError: Symbol.for('ErrorsHandlerDefaultSystemError'),
    ErrorsHandlerSystemError: Symbol.for('ErrorsHandlerSystemError'),
};
