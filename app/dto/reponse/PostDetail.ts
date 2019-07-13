import { PostContent } from '@entities/Post';

export class PostDetail {
  id: string;

  title: string;

  description: string;

  content: PostContent = [];
}
