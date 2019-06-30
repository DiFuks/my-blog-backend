import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';
import { Category } from '@entities/Category';
import { CategoryInfo } from '@dto/reponse/CategoryInfo';

@provide(typesServices.CategoryDtoFactory)
export class CategoryDtoFactory {
    public createPreview(category: Category): CategoryInfo {
        const categoryInfoDto = new CategoryInfo();

        categoryInfoDto.url = category.url;
        categoryInfoDto.title = category.title;

        return categoryInfoDto;
    }
}
