import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { Post } from '@entities/Post';
import { PostInfo } from '@dto/reponse/PostInfo';
import { PostDtoFactory } from '@services/post/PostDtoFactory';
import { PostDetail } from '@dto/reponse/PostDetail';
import { SystemErrorFactory } from '@services/systemError/SystemErrorFactory';
import { SystemErrors } from '@services/systemError/SystemError';
import { RedisCache } from '@services/cache/RedisCache';
import { Category } from '@entities/Category';
import { CategoryDtoFactory } from '@services/post/CategoryDtoFactory';
import { CategoryInfo } from '@dto/reponse/CategoryInfo';

@provide(typesServices.PostService)
export class PostService {
  private readonly postDtoFactory: PostDtoFactory;
  private readonly systemErrorFactory: SystemErrorFactory;
  private readonly redisCache: RedisCache;
  private readonly categoryDtoFactory: CategoryDtoFactory;

  constructor(
    @inject(typesServices.PostDtoFactory) postDtoFactory: PostDtoFactory,
    @inject(typesServices.SystemErrorFactory) systemErrorFactory: SystemErrorFactory,
    @inject(typesServices.RedisCache) redisCache: RedisCache,
    @inject(typesServices.CategoryDtoFactory) categoryDtoFactory: CategoryDtoFactory,
  ) {
    this.postDtoFactory = postDtoFactory;
    this.systemErrorFactory = systemErrorFactory;
    this.redisCache = redisCache;
    this.categoryDtoFactory = categoryDtoFactory;
  }

  public getListByCategory(categoryUrl: string): Promise<Array<PostInfo>> {
    const cacheKey = `post-list-${categoryUrl}`;

    return this.redisCache.resolve<Array<PostInfo>>(cacheKey, async () => {
      const categoryRepository = getRepository(Category);

      const category = await categoryRepository.findOne({
        url: categoryUrl,
      });

      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        relations: ["category"],
        order: {
          createdAt: 'DESC',
        },
        where: {
          category: category,
        }
      });

      return posts.map<PostInfo>(post => this.postDtoFactory.createPreview(post));
    })
  }

  public getShortList(): Promise<Array<PostInfo>> {
    const cacheKey = 'post-short-list';

    return this.redisCache.resolve<Array<PostInfo>>(cacheKey, async () => {
      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        relations: ["category"],
        order: {
          createdAt: 'DESC',
        },
        take: 6,
      });

      return posts.map<PostInfo>(post => this.postDtoFactory.createPreview(post));
    })
  }

  public getCategories(): Promise<Array<CategoryInfo>> {
    const cacheKey = 'categories';

    return this.redisCache.resolve<Array<CategoryInfo>>(cacheKey, async () => {
      const categoryRepository = getRepository(Category);

      const categories = await categoryRepository.find();

      return categories.map<CategoryInfo>(category => this.categoryDtoFactory.createPreview(category));
    })
  }

  public async getByUrl(url: string): Promise<PostDetail> {
    const cacheKey = `post-detail-${url}`;

    const post = await this.redisCache.resolve<PostDetail | null>(cacheKey, async () => {
      const postRepository = getRepository(Post);

      const post = await postRepository.findOne({
        url: url,
      });

      if (!post) {
        return null;
      }

      return this.postDtoFactory.createDetail(post);
    });

    if (!post) {
      throw this.systemErrorFactory.create(SystemErrors.POST_NOT_FOUND);
    }

    return post;
  }

  public getAll(): Promise<Array<Post>> {
    const postRepository = getRepository(Post);

    return postRepository.find();
  }
}
