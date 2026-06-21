import { Form } from './Form';
import { EventEmitter } from './base/Events';

export class ContactsForm extends Form<HTMLElement> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events, 'contacts');
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
  }

  get email(): string {
    return this.emailInput.value;
  }

  get phone(): string {
    return this.phoneInput.value;
  }

  clear(): void {
    super.clear();
    this.emailInput.value = '';
    this.phoneInput.value = '';
  }
}