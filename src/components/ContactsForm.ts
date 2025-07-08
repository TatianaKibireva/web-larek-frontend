import { Component } from "./base/Component";
import { IContactsForm } from "../types";
import { IEvents } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";

export class ContactsForm extends Component<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._emailInput.addEventListener('input', () => this.validate());
        this._phoneInput.addEventListener('input', () => this.validate());
        this.container.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    private validate(): boolean {
        const emailValid = /^\S+@\S+\.\S+$/.test(this._emailInput.value);
        const phoneValid = /^\+?[\d\s\-\(\)]{7,}$/.test(this._phoneInput.value);
        
        this._submitButton.disabled = !(emailValid && phoneValid);
        return emailValid && phoneValid;
    }

    private handleSubmit(event: Event) {
        event.preventDefault();
        if (this.validate()) {
            this.events.emit('contacts:submit', {
                email: this._emailInput.value,
                phone: this._phoneInput.value
            });
        }
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(data?: Partial<IContactsForm>): HTMLElement {
        super.render(data);
        this.validate();
        return this.container;
    }
}