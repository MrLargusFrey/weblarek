import { IBuyer, TPayment, TBuyerErrors } from '../../types';

export class BuyerModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  setField(field: keyof IBuyer, value: string) {
    if (field === 'payment') {
      this[field] = value as TPayment;
    } else {
      this[field] = value;
    }
  }

  setPayment(value: TPayment): void {
    this.payment = value;
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
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}
