import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/Models/ProductsModel';
import { ProductCart } from './components/Models/ProductCart';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL } from './utils/constants';

import { Modal } from './components/Modal';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { CardBasket } from './components/CardBasket';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';

import { IProduct, IOrder } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new ProductsModel(events);
const cartModel = new ProductCart(events);
const buyerModel = new BuyerModel(events);

const gallery = document.querySelector('.gallery') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const modal = new Modal(modalContainer, events);

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basket = new Basket(basketTemplate.content.querySelector('.basket')!.cloneNode(true) as HTMLElement, events);

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderForm = new OrderForm(orderTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLElement, events);

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsForm = new ContactsForm(contactsTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLElement, events);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const success = new Success(successTemplate.content.querySelector('.order-success')!.cloneNode(true) as HTMLElement, events);

larekApi.getProducts()
  .then(response => {
    productsModel.setItems(response.items);
  })
  .catch(error => {
    console.error('Ошибка загрузки товаров:', error);
  });

events.on('products:changed', (data: { items: IProduct[] }) => {
  if (data && data.items) {
    renderCatalog(data.items);
  } else {
    console.error('Ошибка: данные каталога не получены', data);
  }
});

function renderCatalog(products: IProduct[]) {
  if (!products || !Array.isArray(products)) {
    console.error('Ошибка: products не является массивом', products);
    return;
  }
  
  gallery.innerHTML = '';
  
  products.forEach((product) => {
    const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
    if (!cardTemplate) {
      console.error('Шаблон #card-catalog не найден');
      return;
    }
    
    const fragment = cardTemplate.content.cloneNode(true) as DocumentFragment;
    const cardElement = fragment.firstElementChild as HTMLElement;
    
    if (!cardElement) {
      console.error('Не удалось получить элемент из фрагмента');
      return;
    }
    
    const card = new CardCatalog(cardElement, events);
    card.data = product;
    gallery.appendChild(card.render());
  });
}

events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    productsModel.setPreview(product);
  } else {
    console.error('Товар не найден:', data.id);
  }
});

events.on('preview:changed', (product: IProduct) => {
  const cardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
  const card = new CardPreview(cardElement, events);
  card.data = product;
  card.inCart = cartModel.hasItem(product.id);
  modal.open(card.render());
});

events.on('preview:add', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    cartModel.addItem(product);
    modal.close();
  }
});

events.on('preview:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
  modal.close();
});

events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

events.on('cart:changed', (data: { items: IProduct[] }) => {
  const items = data && data.items ? data.items : [];
  updateBasketCounter(items.length);
  updateBasket(items);
});

function updateBasketCounter(count: number) {
  basketCounter.textContent = String(count);
}

function updateBasket(items: IProduct[]) {
  basket.items = items;
  basket.total = cartModel.getTotalPrice();
  basket.isDisabled = items.length === 0;
}

basketButton.addEventListener('click', () => {
  updateBasket(cartModel.getCartItems());
  renderBasketItems(cartModel.getCartItems());
  modal.open(basket.render());
});

function renderBasketItems(items: IProduct[]) {
  const basketList = (basket as any).list;
  basketList.innerHTML = '';
  
  items.forEach((product, index) => {
    const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
    const card = new CardBasket(cardElement, events);
    card.data = product;
    card.index = index;
    basketList.appendChild(card.render());
  });
}

events.on('basket:order', () => {
  modal.close();
  openOrderForm();
});

function openOrderForm() {
  orderForm.clear();
  const buyer = buyerModel.getAll();
  if (buyer.payment) {
    const buttons = (orderForm as any).paymentButtons as HTMLButtonElement[];
    buttons.forEach(btn => {
      if (btn.name === buyer.payment) {
        btn.classList.add('button_alt-active');
      }
    });
  }
  if (buyer.address) {
    const addressInput = (orderForm as any).addressInput as HTMLInputElement;
    addressInput.value = buyer.address;
  }
  validateOrderForm();
  modal.open(orderForm.render());
}

events.on('order:input', () => {
  validateOrderForm();
});

function validateOrderForm() {
  const payment = orderForm.payment;
  const address = orderForm.address;
  const isValid = payment !== null && address.trim() !== '';
  orderForm.valid = isValid;
  
  if (!payment) {
    orderForm.errors = 'Выберите способ оплаты';
  } else if (!address.trim()) {
    orderForm.errors = 'Введите адрес доставки';
  } else {
    orderForm.errors = '';
  }
}

events.on('order:payment', (data: { payment: string }) => {
  buyerModel.setField('payment', data.payment);
  validateOrderForm();
});

events.on('order:submit', () => {
  buyerModel.setField('address', orderForm.address);
  openContactsForm();
});

function openContactsForm() {
  contactsForm.clear();
  const buyer = buyerModel.getAll();
  const emailInput = (contactsForm as any).emailInput as HTMLInputElement;
  const phoneInput = (contactsForm as any).phoneInput as HTMLInputElement;
  if (buyer.email) emailInput.value = buyer.email;
  if (buyer.phone) phoneInput.value = buyer.phone;
  
  validateContactsForm();
  modal.open(contactsForm.render());
}

events.on('contacts:input', () => {
  validateContactsForm();
});

function validateContactsForm() {
  const email = contactsForm.email;
  const phone = contactsForm.phone;
  const isValid = email.trim() !== '' && phone.trim() !== '';
  contactsForm.valid = isValid;
  
  if (!email.trim()) {
    contactsForm.errors = 'Введите email';
  } else if (!phone.trim()) {
    contactsForm.errors = 'Введите телефон';
  } else {
    contactsForm.errors = '';
  }
}

events.on('contacts:submit', () => {
  const email = contactsForm.email;
  const phone = contactsForm.phone;
  buyerModel.setField('email', email);
  buyerModel.setField('phone', phone);
  
  const order: IOrder = {
    payment: buyerModel.getAll().payment as 'card' | 'cash',
    email: email,
    phone: phone,
    address: buyerModel.getAll().address,
    total: cartModel.getTotalPrice(),
    items: cartModel.getCartItems().map(item => item.id)
  };
  
  larekApi.postOrder(order)
    .then(result => {
      success.total = result.total;
      modal.open(success.render());
      cartModel.clearCart();
      buyerModel.clear();
    })
    .catch(error => {
      console.error('Ошибка оформления заказа:', error);
      contactsForm.errors = 'Ошибка при оформлении заказа. Попробуйте снова.';
    });
});

events.on('success:close', () => {
  modal.close();
});

console.log('Веб-ларёк запущен!');