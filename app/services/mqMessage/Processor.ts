import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

import { typesServices } from '@di/typesServices';
import { DataProcessorResolver } from '@services/mqMessage/DataProcessorResolver';
import { BaseDto } from '@services/mqMessage/BaseDto';

@provide(typesServices.MqMessageProcessor)
export class Processor {
  private readonly dataProcessorResolver: DataProcessorResolver;

  constructor(
    @inject(typesServices.MqMessageDataProcessorResolver) dataProcessorResolver: DataProcessorResolver
  ) {
    this.dataProcessorResolver = dataProcessorResolver;
  }

  async process(data: BaseDto): Promise<void> {
    const processor = this.dataProcessorResolver.resolve(data.Type);

    await processor.process(data.Data);
  }
}
