import { provide } from 'inversify-binding-decorators';
import { Translate } from '@google-cloud/translate';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { typesConstants } from '@di/typesConstants';
import { Locales } from '@enum/Locales';

@provide(typesServices.TranslateService)
export class TranslateService {
  private readonly translator: Translate;
  private readonly defaultLocale: Locales;
  private readonly locale: Locales;

  constructor(
    @inject(typesConstants.TranslateKeyFile) keyFile: string,
    @inject(typesConstants.TranslateProjectId) projectId: string,
    @inject(typesConstants.DefaultLocale) defaultLocale: Locales,
    @inject(typesConstants.Locale) locale: Locales,
  ) {
    this.translator = new Translate({
      keyFilename: keyFile,
      projectId: projectId,
    });
    this.defaultLocale = defaultLocale;
    this.locale = locale;
  }

  public async translate(text: string): Promise<string> {
    if (this.locale === this.defaultLocale) {
      return text;
    }

    let [translations] = await this.translator.translate(text, this.locale);

    return translations;
  }

  public async translateArray(text: Array<string>): Promise<Array<string>> {
    if (this.locale === this.defaultLocale) {
      return text;
    }

    const [translations] = await this.translator.translate(text, this.locale);

    return translations;
  }
}
