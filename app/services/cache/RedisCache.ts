import * as Redis from 'ioredis';
import { isNull } from 'lodash';

import { provideSingletonScope } from '@di/decorators';
import { typesServices } from '@di/typesServices';
import { inject } from 'inversify';
import { typesConstants } from '@di/typesConstants';

export interface IGetFromOriginalSourceCallback<T> {
  (): Promise<T>
}

@provideSingletonScope(typesServices.RedisCache)
export class RedisCache {
  private readonly client: Redis.Redis;

  constructor(
    @inject(typesConstants.RedisHost) redisHost: string,
    @inject(typesConstants.RedisPort) redisPort: string
  ) {
    this.client = new Redis(`redis://${redisHost}:${redisPort}`, {
      showFriendlyErrorStack: true
    });
  }

  public get(): Redis.Redis {
    return this.client;
  }

  public async resolve<T>(key: string, getFromOriginalSource: IGetFromOriginalSourceCallback<T>, lifetime?: number): Promise<T> {
    const cached = await this.get().get(key);

    if (isNull(cached)) {
      const objFromOriginalSource = await getFromOriginalSource();

      if (isFinite(lifetime)) {
        await this.get().set(key, JSON.stringify(objFromOriginalSource), 'EX', lifetime);
      } else {
        await this.get().set(key, JSON.stringify(objFromOriginalSource));
      }

      return objFromOriginalSource;
    }

    return JSON.parse(cached);
  }
}
