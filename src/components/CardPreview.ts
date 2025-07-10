import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { CDN_URL } from '../utils/constants';
import { IEvents } from './base/events';

export class CardPreview extends Component<ICard> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _text: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _cardData: ICard | null;
  protected _id: string;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._text = ensureElement<HTMLElement>('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._cardData = null;
	}

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
      return this._id;
  }

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	set text(value: string) {
		this.setText(this._text, value);
	}

	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	get button(): HTMLButtonElement {
		return this._button;
	}

	set inBasket(value: boolean) {
		this.buttonText = value ? 'Удалить из корзины' : 'Добавить в корзину';
	}

	render(data: ICard): HTMLElement {
    this.id = data.id;
		this._cardData = data; // Сохраняем данные
		this.title = data.title;
		this.category = data.category;
		this.image = `${CDN_URL}${data.image}`;
		this.price = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
		this.text = data.description || '';
		this.buttonText = 'Добавить в корзину';
		this.inBasket = false;
		return this.container;
	}
}
