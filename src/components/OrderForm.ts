import { Form } from './Form';
import { EventEmitter } from './base/Events';

export class OrderForm extends Form<HTMLElement> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events, 'order');
    this.paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', (): void => {
        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.events.emit('order:payment', { payment: button.name });
      });
    });
  }

  get payment(): string | null {
    const active = this.paymentButtons.find(b => b.classList.contains('button_alt-active'));
    return active ? active.name : null;
  }

  get address(): string {
    return this.addressInput.value;
  }

  clear(): void {
    super.clear();
    this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
    this.addressInput.value = '';
  }
}