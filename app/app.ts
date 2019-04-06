import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Application } from 'express';

dotenv.config();

import { createContainer } from '@di/container';
import { typesConstants } from '@di/typesConstants';
import { initializeApplicationErrorMiddlewares, initializeApplicationMiddlewares } from '@middlewares/initializeApplication';

(async () => {
  const container = createContainer();

  const basePath = container.get<string>(typesConstants.BasePath);

  const server = new InversifyExpressServer(container, null, { rootPath: basePath });

  server.setConfig((app: Application) => initializeApplicationMiddlewares(app, container));
  server.setErrorConfig((app: Application) => initializeApplicationErrorMiddlewares(app, container));

  const app = server.build();

  app.listen(process.env.APP_PORT);
})();
