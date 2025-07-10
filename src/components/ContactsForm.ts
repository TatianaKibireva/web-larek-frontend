import { Component } from './base/Component';
import { IContactsForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement} from '../utils/utils';

export class ContactsForm extends Component<IContactsForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	protected _valid: boolean = false;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
		this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
		this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
		this._errors = ensureElement<HTMLElement>('.form__errors', container);
	}

	set valid(value: boolean) {
		this._submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	reset() {
		this._emailInput.value =  '';
		this._phoneInput.value =  '';
		this._submitButton.disabled = true;
		this.errors = '';
	}
}
