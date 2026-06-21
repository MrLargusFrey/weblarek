import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export class Success extends Component<HTMLElement> {
  private events: EventEmitter;
  private totalElement: HTMLElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
    this.button = container.querySelector('.order-success__close') as HTMLButtonElement;

    this.button.addEventListener('click', (): void => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}