import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export class Basket extends Component<HTMLElement> {
  private events: EventEmitter;
  private list: HTMLElement;
  private totalElement: HTMLElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.list = container.querySelector('.basket__list') as HTMLElement;
    this.totalElement = container.querySelector('.basket__price') as HTMLElement;
    this.button = container.querySelector('.basket__button') as HTMLButtonElement;

    this.button.addEventListener('click', (): void => {
      this.events.emit('basket:order');
    });
  }

  set items(cardElements: HTMLElement[]) {
    this.list.innerHTML = '';
    if (cardElements.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'basket__empty';
      empty.textContent = 'Корзина пуста';
      this.list.appendChild(empty);
      this.button.disabled = true;
      return;
    }
    this.button.disabled = false;
    cardElements.forEach(el => this.list.appendChild(el));
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set isDisabled(value: boolean) {
    this.button.disabled = value;
  }
}