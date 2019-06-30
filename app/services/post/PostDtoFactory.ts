import { provide } from 'inversify-binding-decorators';

import { Post } from '@entities/Post';
import { typesServices } from '@di/typesServices';
import { PostDetail } from '@dto/reponse/PostDetail';
import { PostInfo } from '@dto/reponse/PostInfo';

@provide(typesServices.PostDtoFactory)
export class PostDtoFactory {
  public createDetail(post: Post): PostDetail {
    const postDetailDto = new PostDetail();

    postDetailDto.content = post.content;
    postDetailDto.title = post.title;
    postDetailDto.id = post.id;

    return postDetailDto;
  }

  public createPreview(post: Post): PostInfo {
    const postInfoDto = new PostInfo();

    postInfoDto.url = post.url;
    postInfoDto.title = post.title;
    postInfoDto.description = post.description;
    postInfoDto.date = post.createdAt;
    postInfoDto.category = post.category.title;

    return postInfoDto;
  }
}
