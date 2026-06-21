import { Form } from './Form';
import { EventEmitter } from './base/Events';

export class ContactsForm extends Form<HTMLElement> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}