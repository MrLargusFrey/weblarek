import { Card } from './Card';
import { IProduct } from '../types';
import { EventEmitter } from './base/Events';

export class CardPreview extends Card {
  private events: EventEmitter;
  private button: HTMLButtonElement;
  private descriptionElement: HTMLElement;
  private productId: string = '';

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.button = container.querySelector('.card__button') as HTMLButtonElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;

    this.button.addEventListener('click', (): void => {
      const isInCart = this.button.textContent === 'Удалить из корзины';
      this.events.emit(isInCart ? 'preview:remove' : 'preview:add', { id: this.productId });
    });
  }

  set data(value: IProduct) {
    super.data = value;
    this.productId = value.id;
    this.descriptionElement.textContent = value.description;
  }

  set inCart(value: boolean) {
    if (value) {
      this.button.textContent = 'Удалить из корзины';
      this.button.disabled = false;
    } else {
      const isUnavailable = this.priceElement.textContent === 'Недоступно';
      this.button.textContent = isUnavailable ? 'Недоступно' : 'Купить';
      this.button.disabled = isUnavailable;
    }
  }
}