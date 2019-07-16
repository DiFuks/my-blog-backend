import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { Category } from '@entities/Category';
import { RedisCache } from '@services/cache/RedisCache';

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

    this.redisCache.get().flushdb();

    await categoryRepository.save(category);
  }

  public async delete(id: string): Promise<void> {
    const categoryRepository = getRepository(Category);

    this.redisCache.get().flushdb();

    await categoryRepository.delete({
      id: id,
    });
  }
}
