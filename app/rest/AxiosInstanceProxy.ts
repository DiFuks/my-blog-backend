import { AxiosInstance, AxiosInterceptorManager, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable } from 'inversify';

import { AxiosResponseLogger } from '@services/responseLogger/AxiosResponseLogger';

@injectable()
export abstract class AxiosInstanceProxy implements AxiosInstance {
  public defaults: AxiosRequestConfig;
  public interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>
  };

  private readonly instance: AxiosInstance;
  private readonly responseLogger: AxiosResponseLogger;

  protected constructor(instance: AxiosInstance, responseLogger: AxiosResponseLogger) {
    this.instance = instance;
    this.responseLogger = responseLogger;

    this.defaults = instance.defaults;
    this.interceptors = instance.interceptors;
  }

  public async delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.instance.delete(url, config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public async get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.get<T, R>(url, config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public async head(url: string, config?: AxiosRequestConfig): Promise<any> {
    const response = await this.instance.head(url, config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public async patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.patch<T, R>(url, data, config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public async post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.post<T, R>(url, data, config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public async put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.put<T, R>(url, data, config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public async request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.request<T, R>(config);

    await this.responseLogger.saveAxiosResponse(response);

    return response;
  }

  public getUri(config?: AxiosRequestConfig): string {
    return '';
  }
}

export interface AxiosInstanceProxy {
  (config: AxiosRequestConfig): AxiosPromise;

  (url: string, config?: AxiosRequestConfig): AxiosPromise;
}
