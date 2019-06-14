import { Post } from '@entities/Post';
import { provide } from 'inversify-binding-decorators';
import { typesServices } from '@di/typesServices';
import { PostDetail } from '@dto/reponse/PostDetail';

@provide(typesServices.PostDetailDtoFactory)
export class PostDetailDtoFactory {
  public createFromEntity(post: Post): PostDetail {
    const postDetailDto = new PostDetail();

    postDetailDto.content = post.content;
    postDetailDto.title = post.title;
    postDetailDto.id = post.id;

    return postDetailDto;
  }
}
