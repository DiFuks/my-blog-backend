import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { Post } from '@entities/Post';
import { RedisCache } from '@services/cache/RedisCache';

@provide(typesServices.PostAdminService)
export class PostAdminService {
  private readonly redisCache: RedisCache;

  constructor(
    @inject(typesServices.RedisCache) redisCache: RedisCache,
  ) {
    this.redisCache = redisCache;
  }

  public getAll(): Promise<Array<Post>> {
    const postRepository = getRepository(Post);

    return postRepository.find({
      relations: ['category'],
      order: {
        createdAt: 'DESC',
      }
    });
  }

  public async save(post: Post): Promise<void> {
    const postRepository = getRepository(Post);

    this.redisCache.get().flushdb();

    await postRepository.save(post);
  }

  public async delete(id: string): Promise<void> {
    const postRepository = getRepository(Post);

    this.redisCache.get().flushdb();

    await postRepository.delete({
      id: id,
    });
  }
}
