import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductCart {
  private cartItems: IProduct[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  getCartItems(): IProduct[] {
    return this.cartItems;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.cartItems.push(product);
      this.events.emit('cart:changed', { items: this.cartItems });
    }
  }

  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.events.emit('cart:changed', { items: this.cartItems });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.events.emit('cart:changed', { items: this.cartItems });
  }

  getCount(): number {
    return this.cartItems.length;
  }

  hasItem(id: string): boolean {
    return this.cartItems.some(item => item.id === id);
  }
}