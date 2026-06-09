import { IProduct } from '../../types';

export class ProductCart {
  private cartItems: IProduct[] = [];

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.cartItems.push(product);
    }
  }

  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getCount(): number {
    return this.cartItems.length;
  }

  hasItem(id: string): boolean {
    return this.cartItems.some(item => item.id === id);
  }
}