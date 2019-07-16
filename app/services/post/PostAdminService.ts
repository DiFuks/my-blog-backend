import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { Post } from '@entities/Post';

@provide(typesServices.PostAdminService)
export class PostAdminService {
  public getAll(): Promise<Array<Post>> {
    const postRepository = getRepository(Post);

    return postRepository.find({
      relations: ['category'],
    });
  }

  public async save(post: Post): Promise<void> {
    const postRepository = getRepository(Post);

    await postRepository.save(post);
  }

  public async delete(id: string): Promise<void> {
    const postRepository = getRepository(Post);

    await postRepository.delete({
      id: id,
    });
  }
}
