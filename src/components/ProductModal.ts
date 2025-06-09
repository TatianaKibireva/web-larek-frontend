import { IProduct, IBasketItem, IOrder } from "../types/index.ts";

export class ProductModel {

  //массив товаров на главной странице
  products: IProduct[];
  //массив товаров в корзине
  basket: IBasketItem[];
  //данные заказа
  order: IOrder | null;

  //возвращает список товаров
  getProducts(): IProduct[];

  //возвращает товар по ID
  getProductById(id: string): IProduct | undefined;

  //добавляет товар в корзину
  addToBasket(product: IProduct): void;

  //удаляет товар из корзины
  removeFromBasket(productId: string): void;

  //возвращает содержимое корзины
  getBasketItems(): IBasketItem[];

  //считает итоговую сумму
  getTotalPrice(): number;

  //очищает корзину после оформления
  clearBasket(): void;
}