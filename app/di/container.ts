import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import * as winston from 'winston';
import { Connection } from 'typeorm';

import { typesConstants } from '@di/typesConstants';
import { winstonLogger } from '@logger/winston';
import { AppEnvironment } from '@enum/AppEnvironment';
import { Locales } from '@enum/Locales';

import '@controllers/index';
import '@middlewares/index';
import '@services/index';

export const createContainer = (connection: Connection): Container => {
  const container = new Container({defaultScope: 'Request'});

  container.bind<AppEnvironment>(typesConstants.NodeEnv).toConstantValue(process.env.NODE_ENV as AppEnvironment);

  container.bind<string>(typesConstants.BasePath).toConstantValue('/api');
  container.bind<winston.Logger>(typesConstants.WinstonLogger).toConstantValue(winstonLogger);
  container.bind<Connection>(typesConstants.DBConnection).toConstantValue(connection);
  container.bind<string>(typesConstants.JwtSecretKey).toConstantValue(process.env.JWT_SECRET_KEY);

  container.bind<string>(typesConstants.RedisHost).toConstantValue(process.env.REDIS_HOST);
  container.bind<string>(typesConstants.RedisPort).toConstantValue(process.env.REDIS_PORT);

  container.bind<string>(typesConstants.BotUrl).toConstantValue(process.env.BOT_URL);

  container.bind<string>(typesConstants.TranslateProjectId).toConstantValue(process.env.TRANSLATE_PROJECT_ID);
  container.bind<string>(typesConstants.TranslateKeyFile).toConstantValue(process.env.TRANSLATE_KEY_FILE);
  container.bind<Locales>(typesConstants.DefaultLocale).toConstantValue(process.env.TRANSLATE_DEFAULT_LOCALE as Locales);
  container.bind<Locales>(typesConstants.Locale).toConstantValue(process.env.TRANSLATE_DEFAULT_LOCALE as Locales);

  container.load(buildProviderModule());

  return container;
};
