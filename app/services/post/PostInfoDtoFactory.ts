import { Post } from '@entities/Post';
import { PostInfo } from '@dto/reponse/PostInfo';
import { provide } from 'inversify-binding-decorators';
import { typesServices } from '@di/typesServices';

@provide(typesServices.PostInfoDtoFactory)
export class PostInfoDtoFactory {
  public createFromEntity(post: Post): PostInfo {
    const postInfoDto = new PostInfo();

    postInfoDto.url = post.url;
    postInfoDto.title = post.menuTitle;

    return postInfoDto;
  }
}
