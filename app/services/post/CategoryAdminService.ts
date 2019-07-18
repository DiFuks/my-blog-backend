import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { Category } from '@entities/Category';
import { RedisCache } from '@services/cache/RedisCache';
import { Locales } from '@enum/Locales';
import { CacheKeys } from '@enum/CacheKeys';

@provide(typesServices.CategoryAdminService)
export class CategoryAdminService {
  private readonly redisCache: RedisCache;

  constructor(
    @inject(typesServices.RedisCache) redisCache: RedisCache,
  ) {
    this.redisCache = redisCache;
  }

  public getAll(): Promise<Array<Category>> {
    const categoryRepository = getRepository(Category);

    return categoryRepository.find({
      order: {
        createdAt: 'DESC',
      }
    });
  }
  
  public async save(category: Category): Promise<void> {
    const categoryRepository = getRepository(Category);

    await this.delCache(category);

    await categoryRepository.save(category);
  }

  public async delete(id: string): Promise<void> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne(id);

    await this.delCache(category);

    await categoryRepository.delete({
      id: id,
    });
  }

  private async delCache(category: Category) {
    await Promise.all(Object.values(Locales).map(async locale => {
      this.redisCache.get().del(`${CacheKeys.POST_SHORT_LIST}${locale}`);

      this.redisCache.get().del(`${CacheKeys.POST_LIST}${category.url}-${locale}`);
    }));
  }
}
