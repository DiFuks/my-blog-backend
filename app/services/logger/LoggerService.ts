import { provide } from 'inversify-binding-decorators';
import * as winston from 'winston';
import { inject } from 'inversify';
import * as StackTrace from 'stacktrace-js';
import * as stringifySafe from 'json-stringify-safe';
import * as moment from 'moment';

import { typesServices } from '@di/typesServices';
import { SessionIdService } from '@services/session/SessionIdService';
import { typesConstants } from '@di/typesConstants';

export const enum LoggerChannelEnum {
  APPLICATION = 'APP',
  MQP = 'mqp'
}

export const enum LoggerLevelEnum {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  NOTICE = 'NOTICE',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  ALERT = 'ALERT',
  EMERGENCY = 'EMERGENCY'
}

export interface ILoggerOptions {
  level?: LoggerLevelEnum;
  channel?: LoggerChannelEnum;
  extra?: object;
  isWithStackTrace?: boolean;
}

export interface ILoggerContext {
  stackTrace?: any;
}

@provide(typesServices.LoggerService)
export class LoggerService {
  private readonly logger: winston.Logger;
  private readonly sessionIdService: SessionIdService;

  private defaultChannel = LoggerChannelEnum.APPLICATION;

  constructor(
    @inject(typesConstants.WinstonLogger) logger: winston.Logger,
    @inject(typesServices.SessionIdService) sessionIdService: SessionIdService
  ) {
    this.logger = logger;
    this.sessionIdService = sessionIdService;
  }

  public getDefaultChannel(): LoggerChannelEnum {
    return this.defaultChannel;
  }

  public setDefaultChannel(channel: LoggerChannelEnum): this {
    this.defaultChannel = channel;

    return this;
  }

  public async debug(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      ...options,
      level: LoggerLevelEnum.DEBUG
    });
  }

  public async info(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      ...options,
      level: LoggerLevelEnum.INFO
    });
  }

  public async notice(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      ...options,
      level: LoggerLevelEnum.NOTICE
    });
  }

  public async warning(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      ...options,
      level: LoggerLevelEnum.WARNING
    });
  }

  public async error(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      isWithStackTrace: true,
      ...options,
      level: LoggerLevelEnum.ERROR
    });
  }

  public async critical(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      isWithStackTrace: true,
      ...options,
      level: LoggerLevelEnum.CRITICAL
    });
  }

  public async alert(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      isWithStackTrace: true,
      ...options,
      level: LoggerLevelEnum.ALERT
    });
  }

  public async emergency(message: string, options?: ILoggerOptions): Promise<void> {
    await this.log(message, {
      isWithStackTrace: true,
      ...options,
      level: LoggerLevelEnum.EMERGENCY
    });
  }

  public async log(message: string, options?: ILoggerOptions): Promise<void> {
    const {isWithStackTrace = false, level, channel, extra} = {
      ...options,
      level: options.level || LoggerLevelEnum.INFO,
      channel: options.channel || this.getDefaultChannel(),
      extra: {
        ...options.extra,
        session_logger_id: this.sessionIdService.getId()
      }
    };

    let context: ILoggerContext = null;

    if (isWithStackTrace) {
      context = {
        stackTrace: await StackTrace.get()
      };
    }

    const
      dateTimeFormatted = moment().format('YYYY-MM-DD HH:mm:ss'),
      extraJSON = stringifySafe(extra),
      contextJSON = stringifySafe(context)
    ;

    this.logger.info(`[${dateTimeFormatted}] ${channel}.${level} message: ${message} context: ${contextJSON} extra: ${extraJSON}`);
  }
}
