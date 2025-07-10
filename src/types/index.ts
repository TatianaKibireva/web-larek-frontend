import { Component } from "../components/base/Component";
import { IEvents } from "../components/base/events";

// Данные товара
export interface ICard {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number | null;
	description?: string;
}

export interface ICatalog {
	cards: ICard[];
}

// Товары в корзине
export interface IBasketItem extends ICard {
	quantity: number;
}

// Данные о заказе
export interface IOrder {
	payment: 'online' | 'offline';
	address: string;
	email: string;
	phone: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
	valid?: boolean;
	errors?: string;
}

export interface IBasketModal {
	items: IBasketItem[];
	total: number;
}

export type PaymentMethod = 'online' | 'offline'; //  варианты оплаты

export interface IOrderForm {
	payment: PaymentMethod | null; // null - если не выбрано
	address: string;
}

export interface IFormState {
	valid: boolean;
	errors: string;
}

export interface ICardConstructor {
	new (template: HTMLTemplateElement, events: IEvents): Component<ICard>;
}

export interface IHeaderBasket {
  counter: number;
}
