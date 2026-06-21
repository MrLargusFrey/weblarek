import { Form } from './Form';
import { EventEmitter } from './base/Events';
import { TPayment } from '../types';

export class OrderForm extends Form<HTMLElement> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', (): void => {
        this.events.emit('order:payment', { payment: button.name as TPayment });
      });
    });
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}