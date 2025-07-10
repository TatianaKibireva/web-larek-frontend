import { ICard, IBasketItem, IOrder, IOrderForm, IContactsForm } from '../types/index';
import { IEvents } from './base/events';

export class CardModel<T> {
	cards: ICard[] = []; //массив товаров на главной странице
	basket: IBasketItem[] = []; //массив товаров в корзине
	order: IOrder | null; //данные заказа

	private _paymentMethod: 'online' | 'offline' | null = null;

	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	getCards(): ICard[] {
		//возвращает список товаров
		return this.cards;
	}

	getCardById(id: string): ICard | undefined {
		//возвращает товар по ID
		return this.cards.find(card => {
			const found = card.id === id;
			return found;
	});
	}

	addToBasket(item: IBasketItem): void {
		const existingItem = this.basket.find((i) => i.id === item.id);
		if (existingItem) {
			existingItem.quantity = (existingItem.quantity || 0) + 1;
		} else {
			this.basket.push({ ...item, quantity: item.quantity || 1 });
		}
		this.emitChanges('basket:changed', {
			items: this.basket,
			total: this.getTotalPrice(),
		});
	}

	removeFromBasket(id: string): void {
		//удаляет товар из корзины
		const itemIndex = this.basket.findIndex((item) => item.id === id);
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
			total: this.getTotalPrice(),
		});
	}

	getBasketItems(): IBasketItem[] {
		//возвращает содержимое корзины
		return this.basket;
	}

	getTotalPrice(): number {
		//считает итоговую сумму
		return this.basket.reduce((total, card) => {
			return total + (card.price || 0) * (card.quantity || 1);
		}, 0);
	}

	clearBasket(): void {
		//очищает корзину после оформления
		this.basket = [];
	}

	setCards(cards: ICard[]) {
		this.cards = cards;
	}

	set payment(method: 'online' | 'offline') {
		this._paymentMethod = method;
		this.events.emit('payment:changed', { method });
	}

	get payment() {
		return this._paymentMethod;
	}

	emitChanges(event: string, payload?: object) {
		// Сообщить всем что модель поменялась
		this.events.emit(event, payload ?? {});
	}

	isInBasket(id: string): boolean {
		return this.basket.some((item) => item.id === id);
	}

	updateOrder(data: Partial<IOrderForm>) {
		//для сохранения данных формы
		this.order = { ...this.order, ...data };
		this.emitChanges('order:changed', this.order);
	}

	validateOrder(data: IOrderForm): { valid: boolean; errors: string } {
		const errors: string[] = [];
	
		if (!data.payment) {
			errors.push('Необходимо выбрать способ оплаты');
		}
	
		if (!data.address) {
				errors.push('Необходимо указать адрес');
		}

		return {
				valid: errors.length === 0,
				errors: errors.join(', ')
		};
	}
	validateContacts(data: IContactsForm): { valid: boolean; errors: string } {
    const errors: string[] = [];
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?[\d\s\-()]{7,}$/;

    if (!emailRegex.test(data.email)) {
        errors.push('Необходимо указать кооректный email');
    }

    if (!phoneRegex.test(data.phone)) {
        errors.push('Необходимо указать кооректный телефон');
    }

    return {
        valid: errors.length === 0,
        errors: errors.join(', ')
    };
}
}
