import { IBasketItem } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { BasketModal } from './BasketModal';
import { Modal } from './common/Modal';

export class BasketPresenter {
	private modal: Modal;
	private basketModal: BasketModal;
	private events: IEvents;

	constructor(events: IEvents, basketTemplate: HTMLTemplateElement) {
		this.events = events;
		this.basketModal = new BasketModal(cloneTemplate(basketTemplate), events);
		const modalContainer = ensureElement<HTMLElement>('#modal-container');
		this.modal = new Modal(modalContainer, events);

		events.on(
			'basket:changed',
			(data: { items: IBasketItem[]; total: number }) => {
				this.basketModal.items = data.items;
				this.basketModal.total = data.total;

				//проверка состояния корзины
				const isEmpty = data.items.length === 0;
				this.basketModal.setButtonState(isEmpty);
			}
		);

		events.on('order:open', () => {
			this.modal.close(); // Закрываем корзину, когда переходим в модальное окно оформления заказа
		});

		this.initBasketButton();
	}

	private initBasketButton(): void {
		const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		basketButton.addEventListener('click', () => this.openBasket());
	}

	private openBasket(): void {
		this.events.emit('basket:update');
		this.modal.content = this.basketModal.render();
		this.modal.open();
		this.events.emit('basket:open');
	}
}
