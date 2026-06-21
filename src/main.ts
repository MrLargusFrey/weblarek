import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/Models/ProductsModel';
import { ProductCart } from './components/Models/ProductCart';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL } from './utils/constants';

import { Modal } from './components/Modal';
import { Catalog } from './components/Catalog';
import { Header } from './components/Header';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { CardBasket } from './components/CardBasket';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';

import { IProduct, IOrder, TPayment } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new ProductsModel(events);
const cartModel = new ProductCart(events);
const buyerModel = new BuyerModel(events);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

const gallery = document.querySelector('.gallery') as HTMLElement;
const catalog = new Catalog(gallery);

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, events);

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basket = new Basket(basketTemplate.content.querySelector('.basket')!.cloneNode(true) as HTMLElement, events);

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderForm = new OrderForm(orderTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLElement, events);

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsForm = new ContactsForm(contactsTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLElement, events);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const success = new Success(successTemplate.content.querySelector('.order-success')!.cloneNode(true) as HTMLElement, events);

const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const previewCard = new CardPreview(
  previewTemplate.content.cloneNode(true) as HTMLElement,
  () => events.emit('preview:toggle')
);

function createCatalogCard(product: IProduct): HTMLElement {
  const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  const fragment = cardTemplate.content.cloneNode(true) as DocumentFragment;
  const cardElement = fragment.firstElementChild as HTMLElement;
  const card = new CardCatalog(cardElement, () => {
    events.emit('card:select', { id: product.id });
  });
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = product.image;
  return card.render();
}

function createBasketCard(product: IProduct, index: number): HTMLElement {
  const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
  const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
  const card = new CardBasket(cardElement, () => {
    events.emit('basket:remove', { id: product.id });
  });
  card.title = product.title;
  card.price = product.price;
  card.index = index;
  return card.render();
}

larekApi.getProducts()
  .then(response => {
    productsModel.setItems(response.items);
  })
  .catch(error => {
    console.error('Ошибка загрузки товаров:', error);
  });

events.on('products:changed', (data: { items: IProduct[] }) => {
  if (data && data.items) {
    catalog.items = data.items.map((product) => createCatalogCard(product));
  }
});

events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getItemById(data.id);
  if (product) {
    productsModel.setPreview(product);
  }
});

events.on('preview:changed', (product: IProduct) => {
  previewCard.title = product.title;
  previewCard.price = product.price;
  previewCard.category = product.category;
  previewCard.image = product.image;
  previewCard.description = product.description;

  const inCart = cartModel.hasItem(product.id);
  previewCard.buttonText = inCart ? 'Удалить из корзины' : (product.price === null ? 'Недоступно' : 'Купить');
  previewCard.buttonDisabled = product.price === null;

  modal.open(previewCard.render());
});

events.on('preview:toggle', () => {
  const product = productsModel.getPreview();
  if (!product) return;

  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product.id);
    modal.close();
  } else {
    if (product.price !== null) {
      cartModel.addItem(product);
      modal.close();
    }
  }
});

events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

events.on('basket:open', () => {
  const items = cartModel.getCartItems();
  const cardElements = items.map((product, index) => createBasketCard(product, index));

  basket.items = cardElements;
  basket.total = cartModel.getTotalPrice();
  basket.isDisabled = items.length === 0;
  modal.open(basket.render());
});

events.on('cart:changed', (data: { items: IProduct[] }) => {
  const items = data && data.items ? data.items : [];
  header.counter = items.length;
});

events.on('basket:order', () => {
  modal.close();
  const buyer = buyerModel.getAll();
  orderForm.payment = buyer.payment;
  orderForm.address = buyer.address || '';
  modal.open(orderForm.render());
});

events.on('order:input', (data: { field: string; value: string }) => {
  if (data.field === 'address') {
    buyerModel.setField('address', data.value);
  }
});

events.on('order:payment', (data: { payment: TPayment }) => {
  buyerModel.setField('payment', data.payment);
});

events.on('order:submit', () => {
  const buyer = buyerModel.getAll();
  contactsForm.email = buyer.email || '';
  contactsForm.phone = buyer.phone || '';
  modal.open(contactsForm.render());
});

events.on('contacts:input', (data: { field: string; value: string }) => {
  if (data.field === 'email') {
    buyerModel.setField('email', data.value);
  } else if (data.field === 'phone') {
    buyerModel.setField('phone', data.value);
  }
});

events.on('buyer:changed', () => {
  const buyer = buyerModel.getAll();
  const errors = buyerModel.validate();

  orderForm.payment = buyer.payment;
  orderForm.address = buyer.address || '';

  const orderErrors: string[] = [];
  if (errors.payment) orderErrors.push(errors.payment);
  if (errors.address) orderErrors.push(errors.address);
  orderForm.errors = orderErrors.join(' ');
  orderForm.valid = orderErrors.length === 0;

  contactsForm.email = buyer.email || '';
  contactsForm.phone = buyer.phone || '';

  const contactsErrors: string[] = [];
  if (errors.email) contactsErrors.push(errors.email);
  if (errors.phone) contactsErrors.push(errors.phone);
  contactsForm.errors = contactsErrors.join(' ');
  contactsForm.valid = contactsErrors.length === 0;
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getAll();

  const order: IOrder = {
    payment: buyer.payment as 'card' | 'cash',
    email: buyer.email,
    phone: buyer.phone,
    address: buyer.address,
    total: cartModel.getTotalPrice(),
    items: cartModel.getCartItems().map(item => item.id),
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
      contactsForm.valid = true;
    });
});

events.on('success:close', () => {
  modal.close();
});

console.log('Веб-ларёк запущен!');