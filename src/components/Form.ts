import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export abstract class Form<T> extends Component<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected inputs: HTMLInputElement[];
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this.formElement = container as HTMLFormElement;
    this.submitButton = container.querySelector('.order__button') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
    this.inputs = Array.from(container.querySelectorAll('.form__input'));

    this.formElement.addEventListener('submit', (e: Event): void => {
      e.preventDefault();
      this.events.emit(`${this.formElement.name}:submit`);
    });

    this.inputs.forEach(input => {
      input.addEventListener('input', (): void => {
        this.events.emit(`${this.formElement.name}:input`, {
          field: input.name,
          value: input.value,
        });
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}