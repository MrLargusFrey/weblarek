import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductsModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    // Передаём объект с полем items
    this.events.emit('products:changed', { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setPreview(product: IProduct): void {
    this.preview = product;
    this.events.emit('preview:changed', product);
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}