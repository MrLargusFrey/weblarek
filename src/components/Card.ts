import { Component } from './base/Component';
import { IProduct } from '../types';
import { categoryMap } from '../utils/constants';

export abstract class Card extends Component<IProduct> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.container = container;
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
  }

  set data(value: IProduct) {
    this.titleElement.textContent = value.title;
    this.price = value.price;
    this.category = value.category;
    this.image = value.image;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Недоступно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const className = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    this.categoryElement.className = `card__category ${className}`;
  }

  set image(value: string) {
    if (value && !value.startsWith('http')) {
      value = `https://larek-api.nomoreparties.co${value}`;
    }
    this.setImage(this.imageElement, value);
  }
}