import { inject } from 'inversify';
import { NextFunction, Response, Request } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';
import { LoggerService } from '@services/logger/LoggerService';
import { typesMiddlewares } from '@di/typesMiddlewares';

@provide(typesMiddlewares.RequestLogger)
export class RequestLogger extends BaseMiddleware {
  private loggerService: LoggerService;

  constructor(
    @inject(typesServices.LoggerService) loggerService: LoggerService
  ) {
    super();

    this.loggerService = loggerService;
  }

  handler(req: Request, res: Response, next: NextFunction): void {
    this.loggerService.info('New request has come', {
      extra: {
        request: {
          ip: req.ip,
          url: req.url,
          headers: req.headers,
          method: req.method,
          query: req.query,
          body: req.body
        }
      }
    });

    const
      oldWrite = res.write,
      oldEnd = res.end,
      chunks = []
    ;

    res.write = function (chunk): boolean {
      chunks.push(chunk);

      return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
      if (chunk) {
        chunks.push(chunk);
      }

      oldEnd.apply(res, arguments);
    };

    res.on('finish', () => {
      const body = Buffer.concat(chunks).toString();

      let bodyToLog;

      try {
        bodyToLog = JSON.parse(body);
      } catch (e) {
        bodyToLog = body;
      }

      this.loggerService.info('Made the response', {
        extra: {
          response: {
            statusCode: res.statusCode,
            headers: res.getHeaders(),
            body: bodyToLog
          }
        }
      });
    });

    next();
  }
}
