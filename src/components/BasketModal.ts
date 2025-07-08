import { IBasketItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasketModal{
  items: IBasketItem[]
  total: number
}

export class BasketModal extends Component<IBasketModal> {
  protected _list: HTMLElement
  protected _total: HTMLElement
  protected _button:HTMLButtonElement
  protected _emptyMessage: HTMLElement;
  private _items: IBasketItem[]; 

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this._items = [];

    this._emptyMessage = document.createElement('li');
    this._emptyMessage.textContent = 'Корзина пуста';
    Object.assign(this._emptyMessage.style, {
      color: 'rgba(255, 255, 255, 1)',
      fontSize: '30px',
      listStyleType: 'none',
      opacity: '0.3'
    });

    this._list = ensureElement<HTMLElement>('.basket__list', this.container)
    this._total = ensureElement<HTMLElement>('.modal__actions .basket__price', this.container)
    this._button = ensureElement<HTMLButtonElement>('.button', this.container)

    this._button.addEventListener('click', () => {
      // Проверяем, что корзина не пуста
      if (this._items.length > 0) {
        this.events.emit('order:open', {
          items: this._items,
          total: this.calculateTotal() // Добавьте этот метод в класс
        });
      }
    });
  }

  private calculateTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  private createBasketItem(item: IBasketItem, index: number): HTMLElement { // Создание DOM товара
    const itemElement = document.createElement('li')
    itemElement.classList.add('basket__item', 'card', 'card_compact')

    const indexSpan = document.createElement('span')
    indexSpan.classList.add('basket__item-index')
    indexSpan.textContent = index.toString();

    const titleSpan = document.createElement('span')
    titleSpan.classList.add('card__title')
    titleSpan.textContent = item.title;

    const priceSpan = document.createElement('span')
    priceSpan.classList.add('card__price')
    priceSpan.textContent = item.price !== null ? `${item.price} синапсов` : 'Бесценно';

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('basket__item-delete')
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('card:remove', { id: item.id });
  });
    itemElement.append(indexSpan, titleSpan, priceSpan, deleteButton)
    return itemElement
  }

   private clearList(): void { // Очистка списка товаров
     while (this._list.firstChild){
       this._list.removeChild(this._list.firstChild)
     }
   }

   set items(items: IBasketItem[]){ // Установка списка товаров
    this._items = [...items]; 
    if (!this._list) return;
     this.clearList()

    if (items.length === 0) {
      this._list.appendChild(this._emptyMessage); // Используем заранее созданное сообщение
    } else {
      items.forEach((item, index) => {
        if (item.id) {
          this._list.appendChild(this.createBasketItem(item, index + 1));
        }
      });
    }
    this.setButtonState(items.length === 0);// обновляем состояние кнопки
   }

   set total(value: number) { // Установка общей суммы
     this.setText(this._total, `${value} синапсов`);
   }

   set buttonText(value: string) { // Установка текста кнопки
     this.setText(this._button, value);
   }

//для управления состоянием кнопки "оформить"
   setButtonState(disabled: boolean) {
    this.setDisabled(this._button, disabled);// встроенный метод Component
    this.toggleClass(this._button, 'button_disabled', disabled); // Добавляем/удаляем класс для стилизации
}
}