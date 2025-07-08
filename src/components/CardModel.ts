import { ICard, IBasketItem, IOrder, IOrderForm } from "../types/index";
import { IEvents } from "./base/events";

export class CardModel<T> {

  //массив товаров на главной странице
  cards: ICard[] = [];
  //массив товаров в корзине
  basket: IBasketItem[] = [];
  //данные заказа
  order: IOrder | null;

  private _paymentMethod: 'online' | 'offline' | null = null;

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

  addToBasket(item: IBasketItem): void {

    const existingItem = this.basket.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
        this.basket.push({...item, quantity: item.quantity || 1});
    }

    this.emitChanges('basket:changed', {
      items: this.basket,
      total: this.getTotalPrice()
    });
}

  //удаляет товар из корзины
  removeFromBasket(id: string): void {

  const itemIndex = this.basket.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    const item = this.basket[itemIndex];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.basket.splice(itemIndex, 1);
    }
    this.updateBasket(); 
  }
}

  private updateBasket(): void {
    this.events.emit('basket:changed', {
        items: this.getBasketItems(),
        total: this.getTotalPrice()
    });
  }

  //возвращает содержимое корзины
  getBasketItems(): IBasketItem[] {
    return this.basket
  };

  //считает итоговую сумму
  getTotalPrice(): number {
    return this.basket.reduce((total, card) => {
      return total + ((card.price || 0) * (card.quantity || 1));
    }, 0)
  };

  //очищает корзину после оформления
  clearBasket(): void {
    this.basket = []
  };

  setCards(cards: ICard[]) {
    this.cards = cards
  
}

set payment(method: 'online' | 'offline') {
  this._paymentMethod = method;
  this.events.emit('payment:changed', { method });
}

get payment() {
  return this._paymentMethod;
}


  // Сообщить всем что модель поменялась
  emitChanges(event: string, payload?: object) {
    this.events.emit(event, payload ?? {});
    }

    isInBasket(id: string): boolean {
      return this.basket.some(item => item.id === id);
    }
//для сохранения данных формы
    updateOrder(data: Partial<IOrderForm>) {
      this.order = { ...this.order, ...data };
      this.emitChanges('order:changed', this.order);
    }


}