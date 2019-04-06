import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { InversifyExpressServer } from 'inversify-express-utils';

dotenv.config();

import { createContainer } from '@di/container';
import { typesConstants } from '@di/typesConstants';

(async () => {
  const container = createContainer();

  const basePath = container.get<string>(typesConstants.BasePath);

  const server = new InversifyExpressServer(container, null, { rootPath: basePath });

  const app = server.build();

  app.listen(process.env.APP_PORT);
})();
