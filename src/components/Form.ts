import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

export abstract class Form<T> extends Component<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected inputs: HTMLInputElement[];
  protected events: EventEmitter;
  protected formName: string;

  constructor(container: HTMLElement, events: EventEmitter, formName: string) {
    super(container);
    this.events = events;
    this.formName = formName;
    this.formElement = container as HTMLFormElement;
    this.submitButton = container.querySelector('.button') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
    this.inputs = Array.from(container.querySelectorAll('.form__input'));

    this.formElement.addEventListener('submit', (e: Event): void => {
      e.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });

    this.inputs.forEach(input => {
      input.addEventListener('input', (): void => {
        this.events.emit(`${this.formName}:input`, this.formData);
      });
    });
  }

  get formData(): Record<string, string> {
    const data: Record<string, string> = {};
    this.inputs.forEach(input => {
      data[input.name] = input.value;
    });
    return data;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  clear(): void {
    this.inputs.forEach(input => input.value = '');
    this.errors = '';
  }
}