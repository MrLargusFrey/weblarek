import { IBuyer, TPayment, ValidationError } from '../../types';

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  setField(field: 'address' | 'phone' | 'email', value: string): void {
    if (field === 'address') this._address = value;
    if (field === 'phone') this._phone = value;
    if (field === 'email') this._email = value;
  }

  setPayment(value: TPayment): void {
    this._payment = value;
  }

  getAll(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  validate(): { isValid: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    if (this._payment === null) {
      errors.push({ field: 'payment', message: 'Не выбран способ оплаты' });
    }
    if (this._address.trim() === '') {
      errors.push({ field: 'address', message: 'Укажите адрес доставки' });
    }
    if (this._phone.trim() === '') {
      errors.push({ field: 'phone', message: 'Укажите телефон' });
    }
    if (this._email.trim() === '') {
      errors.push({ field: 'email', message: 'Укажите email' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}