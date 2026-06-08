import { Api } from './components/base/api';
import { LarekApi } from './components/api/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { ProductCart } from './components/models/ProductCart';
import { BuyerModel } from './components/models/BuyerModel';
import { API_URL } from './utils/constants';

const baseApi = new Api(API_URL);

const larekApi = new LarekApi(baseApi);

const productsModel = new ProductsModel();
const cartModel = new ProductCart();
const buyerModel = new BuyerModel();

console.log('Загружаю товары с сервера');

larekApi.getProducts()
  .then(response => {
    console.log('Товары получены:', response);
    
    productsModel.setItems(response.items);
    
    console.log('Каталог товаров в модели:', productsModel.getItems());
    console.log('Количество товаров:', productsModel.getItems().length);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });

console.log('Тестирование корзины:');

const testProduct = {
  id: 'test',
  description: 'Тестовый товар',
  image: '',
  title: 'Тест',
  category: 'test',
  price: 100
};
cartModel.addItem(testProduct as any);
console.log('Товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость:', cartModel.getTotalPrice());

console.log('Есть ли тестовый товар?', cartModel.hasItem('test'));

cartModel.removeItem('test');
console.log('После удаления, товаров в корзине:', cartModel.getCount());

console.log('Тестирование данных покупателя:');
buyerModel.setField('address', 'г. Москва, ул. Тестовая, д.1');
buyerModel.setField('phone', '+7 999 123 45 67');
buyerModel.setField('email', 'test@example.com');
buyerModel.setPayment('card');
console.log('Данные покупателя:', buyerModel.getAll());

const validation = buyerModel.validate();
console.log('Валидация (должна быть успешной):', validation);

buyerModel.clear();
console.log('После очистки:');
console.log('Данные:', buyerModel.getAll());

const emptyValidation = buyerModel.validate();
console.log('Валидация (должна показать ошибки):', emptyValidation);


console.log('Тестирование завершено. Если вы видите список товаров с сервера — всё работает!');