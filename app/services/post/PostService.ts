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
import { Locales } from '@enum/Locales';
import { typesConstants } from '@di/typesConstants';
import { CacheKeys } from '@enum/CacheKeys';

@provide(typesServices.PostService)
export class PostService {
  private readonly postDtoFactory: PostDtoFactory;
  private readonly systemErrorFactory: SystemErrorFactory;
  private readonly redisCache: RedisCache;
  private readonly categoryDtoFactory: CategoryDtoFactory;
  private readonly locale: Locales;

  constructor(
    @inject(typesServices.PostDtoFactory) postDtoFactory: PostDtoFactory,
    @inject(typesServices.SystemErrorFactory) systemErrorFactory: SystemErrorFactory,
    @inject(typesServices.RedisCache) redisCache: RedisCache,
    @inject(typesServices.CategoryDtoFactory) categoryDtoFactory: CategoryDtoFactory,
    @inject(typesConstants.Locale) locale: Locales,
  ) {
    this.postDtoFactory = postDtoFactory;
    this.systemErrorFactory = systemErrorFactory;
    this.redisCache = redisCache;
    this.categoryDtoFactory = categoryDtoFactory;
    this.locale = locale;
  }

  public getListByCategory(categoryUrl: string): Promise<Array<PostInfo>> {
    const cacheKey = `${CacheKeys.POST_LIST}${categoryUrl}-${this.locale}`;

    return this.redisCache.resolve<Array<PostInfo>>(cacheKey, async () => {
      const categoryRepository = getRepository(Category);

      const category = await categoryRepository.findOne({
        url: categoryUrl,
      });

      if (!category) {
        throw this.systemErrorFactory.create(SystemErrors.POST_CATEGORY_NOT_FOUND);
      }

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

      return Promise.all(
        posts.map<Promise<PostInfo>>(async post => await this.postDtoFactory.createPreview(post))
      );
    })
  }

  public getShortList(): Promise<Array<PostInfo>> {
    const cacheKey = `${CacheKeys.POST_SHORT_LIST}${this.locale}`;

    return this.redisCache.resolve<Array<PostInfo>>(cacheKey, async () => {
      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        relations: ["category"],
        order: {
          createdAt: 'DESC',
        },
        take: 6,
      });

      return Promise.all(
        posts.map<Promise<PostInfo>>(async post => await this.postDtoFactory.createPreview(post))
      );
    })
  }

  public async getCategories(): Promise<Array<CategoryInfo>> {
    const cacheKey = `${CacheKeys.CATEGORIES}${this.locale}`;

    return this.redisCache.resolve<Array<CategoryInfo>>(cacheKey, async () => {
      const categoryRepository = getRepository(Category);

      const categories = await categoryRepository.find();

      return Promise.all(categories.map<Promise<CategoryInfo>>(async category => {
        return await this.categoryDtoFactory.createPreview(category)
      }));
    })
  }

  public async getByUrl(url: string): Promise<PostDetail> {
    const cacheKey = `${CacheKeys.POST_DETAIL}${url}-${this.locale}`;

    const post = await this.redisCache.resolve<PostDetail | null>(cacheKey, async () => {
      const postRepository = getRepository(Post);

      const post = await postRepository.findOne({
        url: url,
      });

      if (!post) {
        return null;
      }

      return await this.postDtoFactory.createDetail(post);
    });

    if (!post) {
      throw this.systemErrorFactory.create(SystemErrors.POST_NOT_FOUND);
    }

    return post;
  }
}
