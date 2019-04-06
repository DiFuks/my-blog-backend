import { get } from 'lodash';

import { SystemErrors } from '@services/systemError/SystemError';

export class Error {
    private code: SystemErrors;

    private data: object;

    private message: string;

    private err: any;

    normalize(): Object {
        return {
            code: this.getCode(),
            data: this.getData(),
            name: get(this.getError(), 'name'),
            message: get(this.getError(), 'message'),
            stack: get(this.getError(), 'stack'),
            error: this.err
        };
    }

    getCode(): SystemErrors {
        return this.code;
    }

    setCode(code: SystemErrors): this {
        this.code = code;

        return this;
    }

    getData(): object {
        return this.data;
    }

    setData(data: object): this {
        this.data = data;

        return this;
    }

    getMessage(): string {
        return this.message;
    }

    setMessage(message: string): this {
        this.message = message;

        return this;
    }

    getError(): any {
        return this.err;
    }

    setError(err: any): this {
        this.err = err;

        return this;
    }
}
