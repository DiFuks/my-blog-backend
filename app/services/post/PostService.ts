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

@provide(typesServices.PostService)
export class PostService {
  @inject(typesServices.PostInfoDtoFactory)
  private readonly postInfoDtoFactory: PostInfoDtoFactory;

  @inject(typesServices.PostDetailDtoFactory)
  private readonly postDetailDtoFactory: PostDetailDtoFactory;

  @inject(typesServices.SystemErrorFactory)
  private readonly systemErrorFactory: SystemErrorFactory;

  public async getList(): Promise<Array<PostInfo>> {
    const postRepository = getRepository(Post);

    const posts = await postRepository.find();

    return posts.map<PostInfo>(post => this.postInfoDtoFactory.createFromEntity(post));
  }

  public async getByUrl(url: string): Promise<PostDetail> {
    const postRepository = getRepository(Post);

    const post = await postRepository.findOne({
      url: url,
    });

    if (!post) {
      throw this.systemErrorFactory.create(SystemErrors.POST_NOT_FOUND);
    }

    return this.postDetailDtoFactory.createFromEntity(post);
  }
}
