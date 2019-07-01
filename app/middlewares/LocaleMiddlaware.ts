import { BaseMiddleware } from 'inversify-express-utils';
import { provide } from 'inversify-binding-decorators';
import * as express from 'express';

import { typesMiddlewares } from '@di/typesMiddlewares';
import { typesConstants } from '@di/typesConstants';
import { Locales } from '@enum/Locales';
import { inject } from 'inversify';

@provide(typesMiddlewares.LocaleMiddlaware)
export class LocaleMiddlaware extends BaseMiddleware {
  private readonly defaultLocale: Locales;

  constructor(
    @inject(typesConstants.DefaultLocale) defaultLocale: Locales,
  ) {
    super();

    this.defaultLocale = defaultLocale;
  }

  public handler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const locale = req.query.locale as Locales || this.defaultLocale;

    this.bind<Locales>(typesConstants.Locale).toConstantValue(locale);

    next();
  }
}
