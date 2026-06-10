import './scss/styles.scss';
import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';
import { ProductsModel } from './components/Models/ProductsModel';
import { ProductCart } from './components/Models/ProductCart';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const baseApi = new Api(API_URL);

const larekApi = new LarekApi(baseApi);

const productsModel = new ProductsModel();
const cartModel = new ProductCart();
const buyerModel = new BuyerModel();

console.log('Тестирование моделей на маковых данных');

console.log('ProductsModel');

productsModel.setItems(apiProducts.items);
console.log('setItems: массив товаров сохранён');

console.log('getItems:', productsModel.getItems());
console.log('Количество товаров:', productsModel.getItems().length);

const testId = apiProducts.items[0]?.id;
const foundProduct = productsModel.getItemById(testId);
console.log(`getItemById("${testId}"):`, foundProduct);

const notFoundProduct = productsModel.getItemById('non-existent-id');
console.log('getItemById("non-existent-id"):', notFoundProduct);

productsModel.setPreview(apiProducts.items[0]);
console.log('setPreview: установлен товар для просмотра');

console.log('getPreview:', productsModel.getPreview());

console.log('ProductCart');

console.log('getCartItems (начальная):', cartModel.getCartItems());

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
cartModel.addItem(apiProducts.items[0]); // попытка добавить дубликат
console.log('addItem: добавлены товары (первый и второй)');

console.log('getCartItems (после добавления):', cartModel.getCartItems());

console.log('getCount:', cartModel.getCount());

console.log('getTotalPrice:', cartModel.getTotalPrice());

console.log(`hasItem("${apiProducts.items[0].id}"):`, cartModel.hasItem(apiProducts.items[0].id));
console.log('hasItem("non-existent-id"):', cartModel.hasItem('non-existent-id'));

cartModel.removeItem(apiProducts.items[0].id);
console.log('removeItem: удалён первый товар');
console.log('getCartItems после удаления:', cartModel.getCartItems());
console.log('getCount после удаления:', cartModel.getCount());

cartModel.clearCart();
console.log('clearCart: корзина очищена');
console.log('getCartItems после очистки:', cartModel.getCartItems());
console.log('getCount после очистки:', cartModel.getCount());

console.log('BuyerModel');

buyerModel.setField('address', 'г. Москва, ул. Тестовая, д.1');
buyerModel.setField('phone', '+7 999 123 45 67');
buyerModel.setField('email', 'test@example.com');
console.log('setField: address, phone, email заполнены');

buyerModel.setField('payment', 'card');
console.log('setPayment: payment = "card"');

console.log('getAll (полностью заполненный):', buyerModel.getAll());

const validErrors = buyerModel.validate();
console.log('validate (должен быть пустой объект):', validErrors);
console.log('Валидно?', Object.keys(validErrors).length === 0);

buyerModel.clear();
console.log('clear: данные очищены');

console.log('getAll после очистки:', buyerModel.getAll());

const invalidErrors = buyerModel.validate();
console.log('validate после очистки (ошибки):', invalidErrors);
console.log('Ошибки в полях:', Object.keys(invalidErrors));

console.log('Запрос к серверу');
console.log('Загружаю товары с сервера...');

larekApi.getProducts()
  .then(response => {
    console.log('Товары с сервера получены:', response);
    
    productsModel.setItems(response.items);
    
    console.log('Массив товаров сохранён в productsModel');
    console.log('Количество товаров с сервера:', productsModel.getItems().length);
    console.log('Первый товар:', productsModel.getItems()[0]?.title);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  });

console.log('Тестирование завершено');