import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { Post } from '@entities/Post';
import { PostInfo } from '@dto/reponse/PostInfo';
import { PostInfoDtoFactory } from '@services/post/PostInfoDtoFactory';
import { PostDetailDtoFactory } from '@services/post/PostDetailDtoFactory';
import { PostDetail } from '@dto/reponse/PostDetail';
import { SystemErrorFactory } from '@services/systemError/SystemErrorFactory';
import { SystemErrors } from '@services/systemError/SystemError';
import { RedisCache } from '@services/cache/RedisCache';

@provide(typesServices.PostService)
export class PostService {
  @inject(typesServices.PostInfoDtoFactory)
  private readonly postInfoDtoFactory: PostInfoDtoFactory;

  @inject(typesServices.PostDetailDtoFactory)
  private readonly postDetailDtoFactory: PostDetailDtoFactory;

  @inject(typesServices.SystemErrorFactory)
  private readonly systemErrorFactory: SystemErrorFactory;

  @inject(typesServices.RedisCache)
  private readonly redisCache: RedisCache;

  public getList(): Promise<Array<PostInfo>> {
    const cacheKey = 'post-list';

    return this.redisCache.resolve<Array<PostInfo>>(cacheKey, async () => {
      const postRepository = getRepository(Post);

      const posts = await postRepository.find();

      return posts.map<PostInfo>(post => this.postInfoDtoFactory.createFromEntity(post));
    })
  }

  public async getByUrl(url: string): Promise<PostDetail> {
    const cacheKey = `post-detail-${url}`;

    const post = await this.redisCache.resolve<PostDetail|null>(cacheKey, async () => {
      const postRepository = getRepository(Post);

      const post = await postRepository.findOne({
        url: url,
      });

      if (!post) {
        return null;
      }

      return this.postDetailDtoFactory.createFromEntity(post);
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
