import { Component } from './base/Component';
import { IProduct } from '../types';
import { EventEmitter } from './base/Events';

export class CardBasket extends Component<IProduct> {
  private events: EventEmitter;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;
  private productId: string = '';

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', (): void => {
      this.events.emit('basket:remove', { id: this.productId });
    });
  }

  set data(value: IProduct) {
    this.productId = value.id;
    this.titleElement.textContent = value.title;
    this.priceElement.textContent = value.price === null ? 'Недоступно' : `${value.price} синапсов`;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value + 1);
  }
}