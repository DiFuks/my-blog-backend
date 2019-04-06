import { Response } from 'express';

export interface IRESTErrorHandler {
  handle(err: any, res: Response): void;
}
