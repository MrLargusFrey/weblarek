import { IApi } from '../../types';
import { IOrder, IOrderResult, IProductsResponse } from '../../types';

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductsResponse> {
  return this.api.get<IProductsResponse>("/product/");
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post('/order', order) as Promise<IOrderResult>;
  }
}