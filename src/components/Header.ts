import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export class Header extends Component<HTMLElement> {
  private basketButton: HTMLButtonElement;
  private basketCounter: HTMLElement;
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}