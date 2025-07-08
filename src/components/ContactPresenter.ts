import { IEvents } from './base/events';
import { Modal } from './common/Modal';
import { ContactsForm } from './ContactsForm';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { CardModel } from './CardModel';

export class ContactsPresenter {
	private modal: Modal;
	private form: ContactsForm;
	private cardModel: CardModel<any>;

	constructor(
		events: IEvents,
		template: HTMLTemplateElement,
		cardModel: CardModel<any>
	) {
		this.modal = new Modal(ensureElement('#modal-container'), events);
		this.form = new ContactsForm(cloneTemplate(template), events);
		this.cardModel = cardModel;

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
	}

	private getTotalPrice(): number {
		return this.cardModel.getTotalPrice();
	}

	private openForm(): void {
		this.modal.content = this.form.render({
			email: '',
			phone: '',
			valid: false,
			errors: '',
		});
		this.modal.open();
	}
}
