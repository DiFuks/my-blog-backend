import { provide } from 'inversify-binding-decorators';

import { typesServices } from '@di/typesServices';

@provide(typesServices.UserSessionTokenManager)
export class TokenManager {
    private token: string = '';

    public get(): string {
        return this.token;
    }

    public set(token: string): this {
        this.token = token;

        return this;
    }
}
