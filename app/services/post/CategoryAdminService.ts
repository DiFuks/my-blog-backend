import { provide } from 'inversify-binding-decorators';
import { getRepository } from 'typeorm';

import { typesServices } from '@di/typesServices';
import { Category } from '@entities/Category';

@provide(typesServices.CategoryAdminService)
export class CategoryAdminService {
  public getAll(): Promise<Array<Category>> {
    const postRepository = getRepository(Category);

    return postRepository.find();
  }
}
