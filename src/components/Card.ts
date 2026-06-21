import { Component } from './base/Component';
import { IProduct } from '../types';

export abstract class Card extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Недоступно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}