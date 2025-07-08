import { ICard } from '../types';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class CardView extends Component<ICard> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description: string;
	protected _cardData: ICard;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(cloneTemplate(template));

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);

		this.container.addEventListener('click', () => {
			if (this._cardData) {
				events.emit('card:select', { ...this._cardData });
			}
		});
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this._title.textContent || '');
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	render(data: ICard): HTMLElement {
		this._cardData = data;

		this.setText(this._title, data.title);
		this.setText(this._category, data.category);
		this.setImage(this._image, `${CDN_URL}${data.image}`, data.title);
		this.setText(this._price, `${data.price} синапсов`);
		this._description = data.description;
		return this.container;
	}

	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt: string
	): void {
		const imageUrl = src.startsWith('http') ? src : `${CDN_URL}${src}`;
		element.src = imageUrl;
		element.alt = alt;
	}
}
