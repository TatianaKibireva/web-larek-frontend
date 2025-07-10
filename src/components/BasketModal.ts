import { IBasketItem, IBasketModal } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { BasketItemView } from './BasketItemView';

export class BasketModal extends Component<IBasketModal> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _emptyMessage: HTMLElement;
	private _items: IBasketItem[];

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._items = [];

		this._emptyMessage = document.createElement('li');
		this._emptyMessage.textContent = 'Корзина пуста';
    this._emptyMessage.classList.add('basket-emptyMessage');

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>(
			'.modal__actions .basket__price',
			this.container
		);
		this._button = ensureElement<HTMLButtonElement>('.button', this.container);

		this._button.addEventListener('click', () => {
			// Проверяем, что корзина не пуста
			if (this._items.length > 0) {
				this.events.emit('order:open', {
					items: this._items,
					total: this.calculateTotal(), // Добавьте этот метод в класс
				});
			}
		});
	}

	private calculateTotal(): number {
		return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	private createBasketItem(item: IBasketItem, index: number): HTMLElement {
    const template = ensureElement<HTMLTemplateElement>('#card-basket');
    const basketItem = new BasketItemView (cloneTemplate(template), this.events);
    return basketItem.render({ 
			  ...item,
        index: index 
    });
}

	private clearList(): void {
		// Очистка списка товаров
		while (this._list.firstChild) {
			this._list.removeChild(this._list.firstChild);
		}
	}

	set items(items: IBasketItem[]) {
		// Установка списка товаров
		this._items = [...items];
		if (!this._list) return;
		this.clearList();

		if (items.length === 0) {
			this._list.appendChild(this._emptyMessage); // Используем заранее созданное сообщение
		} else {
			items.forEach((item, index) => {
				if (item.id) {
					this._list.appendChild(this.createBasketItem(item, index + 1));
				}
			});
		}
		this.setButtonState(items.length === 0); // обновляем состояние кнопки
	}

	set total(value: number) {
		// Установка общей суммы
		this.setText(this._total, `${value} синапсов`);
	}

	set buttonText(value: string) {
		// Установка текста кнопки
		this.setText(this._button, value);
	}

	//для управления состоянием кнопки "оформить"
	setButtonState(disabled: boolean) {
		this.setDisabled(this._button, disabled); // встроенный метод Component
		this.toggleClass(this._button, 'button_disabled', disabled); // Добавляем/удаляем класс для стилизации
	}
}
