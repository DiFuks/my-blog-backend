import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { Category } from '@entities/Category';
import { CategoryInfo } from '@dto/reponse/CategoryInfo';
import { TranslateService } from '@services/translate/TranslateService';

@provide(typesServices.CategoryDtoFactory)
export class CategoryDtoFactory {
  private readonly translate: TranslateService;

  constructor(
    @inject(typesServices.TranslateService) translate: TranslateService,
  ) {
    this.translate = translate;
  }

  public async createPreview(category: Category): Promise<CategoryInfo> {
    const categoryInfoDto = new CategoryInfo();

    categoryInfoDto.url = category.url;
    categoryInfoDto.title = await this.translate.translate(category.title);

    return categoryInfoDto;
  }
}
