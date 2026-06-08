import { IApi } from '../base/api';
import { IOrder, IOrderResult, IProductsResponse } from '../../types';

export class LarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProductsResponse> {
  return this._api.get('/product') as Promise<IProductsResponse>;
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post('/order', order) as Promise<IOrderResult>;
  }
}