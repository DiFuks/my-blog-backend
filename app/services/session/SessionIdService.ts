import { Guid } from 'guid-typescript';
import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';

@provide(typesServices.SessionIdService)
export class SessionIdService {
    private readonly id: string;

    constructor() {
        this.id = Guid.create().toString();
    }

    public getId(): string {
        return this.id;
    }
}
