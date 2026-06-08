import { IProduct } from '../../types';

export class ProductCart {
  private _cartItems: IProduct[] = [];

  getCartItems(): IProduct[] {
    return this._cartItems;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this._cartItems.push(product);
    }
  }

  removeItem(productId: string): void {
    this._cartItems = this._cartItems.filter(item => item.id !== productId);
  }

  getTotalPrice(): number {
    return this._cartItems.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  clearCart(): void {
    this._cartItems = [];
  }

  getCount(): number {
    return this._cartItems.length;
  }

  hasItem(id: string): boolean {
    return this._cartItems.some(item => item.id === id);
  }
}