import { ICard, IBasketItem, IOrder } from "../types/index";
import { IEvents } from "./base/events";

export class CardModel<T> {

  //массив товаров на главной странице
  cards: ICard[];
  //массив товаров в корзине
  basket: IBasketItem[];
  //данные заказа
  order: IOrder | null;

  constructor(data: Partial<T>, protected events: IEvents) {
    Object.assign(this, data);
}

  //возвращает список товаров
  getCards(): ICard[] {
    return this.cards
  };

  //возвращает товар по ID
  getCardById(id: string): ICard | undefined {
    return this.cards.find(cards => {cards.id === id})
  };

  //добавляет товар в корзину
  addToBasket(card: IBasketItem): void {
    this.basket.push(card)
  };

  //удаляет товар из корзины
  removeFromBasket(cardId: string): IBasketItem[] {
    return this.basket.filter(item => item.id !== cardId);
  };

  //возвращает содержимое корзины
  getBasketItems(): IBasketItem[] {
    return this.basket
  };

  //считает итоговую сумму
  getTotalPrice(): number {
    return this.basket.reduce((total, card) => {
      return total + (card.price !== null ? card.price * card.quantity : 0)
    }, 0)
  };

  //очищает корзину после оформления
  clearBasket(): void {
    this.basket = []
  };

  setCards(cards: ICard[]) {
    this.cards = cards
  }

  // Сообщить всем что модель поменялась
  emitChanges(event: string, payload?: object) {
    // Состав данных можно модифицировать
    this.events.emit(event, payload ?? {});
    }
}