import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { Post } from '@entities/Post';
import { typesServices } from '@di/typesServices';
import { PostDetail } from '@dto/reponse/PostDetail';
import { PostInfo } from '@dto/reponse/PostInfo';
import { TranslateService } from '@services/translate/TranslateService';
import { PostTypes } from '@enum/PostTypes';

@provide(typesServices.PostDtoFactory)
export class PostDtoFactory {
  private readonly translate: TranslateService;

  constructor(
    @inject(typesServices.TranslateService) translate: TranslateService,
  ) {
    this.translate = translate;
  }

  public async createDetail(post: Post): Promise<PostDetail> {
    const postDetailDto = new PostDetail();

    postDetailDto.content = await Promise.all(post.content.map(async item => {
      if(item.type === PostTypes.TEXT) {
        return {
          type: item.type,
          content: await this.translate.translate(item.content),
        };
      } else {
        return item;
      }
    }));

    postDetailDto.title = await this.translate.translate(post.title);
    postDetailDto.id = post.id;

    return postDetailDto;
  }

  public async createPreview(post: Post): Promise<PostInfo> {
    const postInfoDto = new PostInfo();

    postInfoDto.url = post.url;
    [postInfoDto.title, postInfoDto.description, postInfoDto.category] = await this.translate.translateArray([
      post.title,
      post.description,
      post.category.title
    ]);

    postInfoDto.date = post.createdAt;

    return postInfoDto;
  }
}
