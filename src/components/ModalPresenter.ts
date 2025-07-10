import { ICard } from '../types';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { CardModel } from './CardModel';
import { CardPreview } from './CardPreview';
import { Modal } from './common/Modal';

export class ModalPresenter {
	events: IEvents;
	private modal: Modal;
	private cardPreview: CardPreview;

	constructor(
		events: IEvents,
		private cardModel: CardModel<any>,
		previewTemplate: HTMLTemplateElement
	) {
		//инициализация модального окна
		const modalContainer = ensureElement<HTMLElement>('#modal-container');
		this.modal = new Modal(modalContainer, events);

		//инициализация компонента детального просмотра карточки товара
		this.cardPreview = new CardPreview(cloneTemplate(previewTemplate), events);

		//подписка на события
		events.on('card:select', (card: ICard) => this.showCardDetails(card));

		events.on('basket:changed', () => {
			if (this.cardPreview.id) { // проверяем наличие id
        this.updateButtonState(this.cardPreview.id); // используем id из презентера
    }
		});

		// обработчик клика по кнопке Добавить в корзину
		this.cardPreview.button.addEventListener('click', () => {
			const cardId = this.cardPreview.id;
			if (this.cardModel.isInBasket(cardId)) {
					events.emit('card:remove', {id: cardId});
			} else {
					const cardData = this.cardModel.getCardById(cardId);
					if (cardData) {
							events.emit('card:add', { 
									card: {
											id: cardData.id,
											title: cardData.title,
											price: cardData.price,
											category: cardData.category,
											image: cardData.image
									} 
							});
					}
			}
		});
	}

	private updateButtonState(cardId: string): void {
		const isInBasket = this.cardModel.isInBasket(cardId);
		this.cardPreview.inBasket = isInBasket;
		this.cardPreview.buttonText = isInBasket
			? 'Удалить из корзины'
			: 'Добавить в корзину';
	}

	private showCardDetails(card: ICard): void {
		this.updateButtonState(card.id);

		this.cardPreview.render(card);

		// заполним данные карточки товара
		this.cardPreview.title = card.title;
		this.cardPreview.category = card.category;
		this.cardPreview.image = `${CDN_URL}${card.image}`;
		this.cardPreview.price =
			card.price !== null ? `${card.price} синапсов` : 'Бесценно';
		this.cardPreview.text = card.description;
		this.cardPreview.buttonText = 'Добавить в корзину';

		//инициализация контанта и открытие модального окна
		this.modal.content = this.cardPreview.render(card);
		this.modal.open();
	}
}
