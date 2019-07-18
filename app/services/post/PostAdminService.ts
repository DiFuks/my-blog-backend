import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { Post } from '@entities/Post';
import { RedisCache } from '@services/cache/RedisCache';
import { Locales } from '@enum/Locales';
import { CacheKeys } from '@enum/CacheKeys';
import { PostService } from '@services/post/PostService';

@provide(typesServices.PostAdminService)
export class PostAdminService {
  private readonly redisCache: RedisCache;
  private readonly postService: PostService;

  constructor(
    @inject(typesServices.RedisCache) redisCache: RedisCache,
    @inject(typesServices.PostService) postService: PostService,
  ) {
    this.redisCache = redisCache;
    this.postService = postService;
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

    await this.deleteCache(post);

    await postRepository.save(post);
  }

  public async delete(id: string): Promise<void> {
    const postRepository = getRepository(Post);

    const post = await postRepository.findOne(id);

    await this.deleteCache(post);

    await postRepository.delete({
      id: id,
    });
  }

  private async deleteCache(post: Post) {
    await Promise.all(Object.values(Locales).map(async locale => {
      this.redisCache.get().del(`${CacheKeys.POST_DETAIL}${post.url}-${locale}`);

      this.redisCache.get().del(`${CacheKeys.POST_LIST}${post.category.url}-${locale}`);

      const shortList = await this.postService.getShortList();

      shortList.forEach(item => {
        if (item.url === post.url) {
          this.redisCache.get().del(`${CacheKeys.POST_SHORT_LIST}${locale}`);
        }
      })
    }));
  }
}
