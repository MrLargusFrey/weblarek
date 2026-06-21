import { Card } from './Card';
import { IProduct } from '../types';
import { EventEmitter } from './base/Events';

export class CardCatalog extends Card {
  private events: EventEmitter;
  private productId: string = '';

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    container.addEventListener('click', (): void => {
      this.events.emit('card:select', { id: this.productId });
    });
  }

  set data(value: IProduct) {
    super.data = value;
    this.productId = value.id;
  }
}