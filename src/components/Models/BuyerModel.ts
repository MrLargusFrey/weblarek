import { IBuyer, TPayment, TBuyerErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setField(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
      this.payment = value as TPayment;
    } else if (field === 'address') {
      this.address = value;
    } else if (field === 'phone') {
      this.phone = value;
    } else if (field === 'email') {
      this.email = value;
    }
    this.events.emit('buyer:changed', this.getAll());
  }

  getAll(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:changed', this.getAll());
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (this.payment === null) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }
    if (this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    if (this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}