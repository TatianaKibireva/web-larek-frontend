import { IFormState, PaymentMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class OrderForm extends Component<IFormState> {
	protected _onlineButton: HTMLButtonElement;
	protected _offlineButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;
	protected _errorElement: HTMLElement;

	protected _payment: PaymentMethod | null = null;
	protected _address = '';
	protected _valid = false;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._onlineButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			container
		);
		this._offlineButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this._errorElement = ensureElement<HTMLElement>('.form__errors', container);

		this._initHandlers();
		this._updateSubmitButton();
	}

	private _initHandlers() {
		this._onlineButton.addEventListener('click', () =>
			this._selectPayment('online')
		);
		this._offlineButton.addEventListener('click', () =>
			this._selectPayment('offline')
		);
		this._addressInput.addEventListener('input', () =>
			this._handleAddressChange()
		);
		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:submit', e);
		});
	}

	private _selectPayment(method: PaymentMethod) {
		this._payment = method;
		this._updateSubmitButton();
		this._updatePaymentButtons(method);
		this.events.emit('payment:changed', { method });
	}

	private _updatePaymentButtons(selectedMethod: PaymentMethod) {
		this._onlineButton.classList.toggle(
			'button_alt-active',
			selectedMethod === 'online'
		);
		this._offlineButton.classList.toggle(
			'button_alt-active',
			selectedMethod === 'offline'
		);
	}

	private _handleAddressChange(): void {
		this._address = this._addressInput.value;
		this._validateForm();
		this.events.emit('address:change', { address: this._address });
	}

	get payment(): PaymentMethod | null {
		return this._payment;
	}

	set payment(value: PaymentMethod | null) {
		this._payment = value;
	}

	get address(): string {
		return this._address;
	}

	set address(value: string) {
		this._address = value;
	}

	get valid(): boolean {
		return this._valid;
	}

	set valid(value: boolean) {
		this._valid = value;
		this._updateSubmitButton();
	}

	set errors(value: string) {
		this.setText(this._errorElement, value);
	}

	reset() {
		this._onlineButton.classList.remove('button_alt-active');
		this._offlineButton.classList.remove('button_alt-active');
		this._addressInput.value = '';
		this._payment = null;
		this._address = '';
		this._valid = false;
		this._updateSubmitButton();
	}

	private _updateSubmitButton() {
		this._submitButton.disabled = !this._valid;
	}

	private _validateForm(): void {
		this._valid = Boolean(this._payment) && this._address.trim().length > 0;
		this._updateSubmitButton();
	}
}
