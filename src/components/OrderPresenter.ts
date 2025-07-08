import { IFormState } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { CardModel } from './CardModel';
import { Modal } from './common/Modal';
import { OrderForm } from './OrderForm';

export class OrderPresenter {
	private modal: Modal;
	private orderForm: OrderForm;
	private cardModel: CardModel<any>;

	private formContainer: HTMLElement;
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	constructor(
		protected events: IEvents,
		orderTemplate: HTMLTemplateElement,
		cardModel: CardModel<any>
	) {
		this.formContainer = cloneTemplate(orderTemplate);
		this.paymentButtons = Array.from(
			this.formContainer.querySelectorAll('.order__buttons .button')
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.formContainer
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.formContainer
		);

		this.cardModel = cardModel;
		this.modal = new Modal(ensureElement('#modal-container'), events); // Инициализация модального окна
		this.orderForm = new OrderForm(cloneTemplate(orderTemplate), events); // Инициализация формы заказа

		this.setupEventListeners(events); // Настройка обработчиков
	}

	private setupEventListeners(events: IEvents): void {
		// Обработка открытия формы заказа
		this.events.on('order:open', () => {
			this.events.on('order:open', () => {
				// Проверяем корзину через модель
				const items = this.cardModel.getBasketItems();
				if (items.length === 0) {
					return;
				}
				this.modal.close(); // Закрываем предыдущее модальное окно
				this.orderForm.reset(); // Сбрасываем и открываем форму
				this.modal.content = this.orderForm.render({
					payment: null,
					address: '',
					valid: false,
					errors: '',
				} as IFormState);
				this.modal.open();
			});
		});

		// Обработчики выбора способа оплаты
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((btn) =>
					btn.classList.remove('button_active')
				);
				button.classList.add('button_active');
				events.emit('payment:changed', {
					payment: button.dataset.payment as 'online' | 'offline',
				});
			});
		});

		// Обработчик ввода адреса
		this.addressInput.addEventListener('input', () => {
			events.emit('address:changed', {
				address: this.addressInput.value,
			});
		});

		// Обработчик отправки формы
		this.formContainer.addEventListener('submit', (e) => {
			e.preventDefault();
			events.emit('order:submit');
		});

		this.events.on('order:submit', () => {
			if (this.orderForm.valid) {
				this.events.emit('contacts:open');
			}
		});
	}

	openForm() {
		this.modal.content = this.formContainer;
		this.modal.open();
		this.resetForm();
	}

	private resetForm() {
		this.paymentButtons.forEach((btn) => btn.classList.remove('button_active'));
		this.addressInput.value = '';
		this.submitButton.disabled = true;
	}

	setValidState(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}
}
