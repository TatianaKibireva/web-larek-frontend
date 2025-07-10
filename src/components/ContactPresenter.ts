import { IEvents } from './base/events';
import { Modal } from './common/Modal';
import { ContactsForm } from './ContactsForm';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { CardModel } from './CardModel';

export class ContactsPresenter {
	private modal: Modal;
	private form: ContactsForm;
	private cardModel: CardModel<any>;

	private formContainer: HTMLElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private errorsElement: HTMLElement;

	constructor(events: IEvents, template: HTMLTemplateElement, cardModel: CardModel<any>) {
		this.formContainer = cloneTemplate(template);
		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.formContainer);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.formContainer);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formContainer);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.formContainer);

		this.modal = new Modal(ensureElement('#modal-container'), events);
		this.cardModel = cardModel;

		this.setupEventListeners(events);
	}
	private setupEventListeners(events: IEvents): void {
		events.on('contacts:open', () => {
			this.openForm();
		});

		events.on('contacts:submit', (data) => {
			events.emit('order:complete', {
				...data,
				payment: this.cardModel.order?.payment || '',
				address: this.cardModel.order?.address || '',
			});
			events.emit('order:success', {
				total: this.getTotalPrice(), // получить сумму из модели
			});
		});

		this.emailInput.addEventListener('input', () => {
			this.validateForm();});  // валидация при вводе email
		this.phoneInput.addEventListener('input', () => {this.validateForm();});  // валидация при вводе телефона

		this.formContainer.addEventListener('submit', (e) => {  // обработчик отправки формы
				e.preventDefault();
				if (this.validateForm()) {
						events.emit('contacts:submit', {
								email: this.emailInput.value,
								phone: this.phoneInput.value
						});
				}
		});
}

	private validateForm(): boolean {
		const validation = this.cardModel.validateContacts({
				email: this.emailInput.value,
				phone: this.phoneInput.value
		});
		console.log('Validation errors:', validation.errors); 
		this.errorsElement.textContent = validation.errors; 
		this.setValidState(validation.valid);
		
		return validation.valid;
	}

	private resetForm(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.submitButton.disabled = true;
	}

	private setValidState(isValid: boolean): void {
		this.submitButton.disabled = !isValid;
	}	

	private getTotalPrice(): number {
		return this.cardModel.getTotalPrice();
	}

	private openForm(): void {
		this.modal.content = this.formContainer;
		this.modal.open();
	}
}
