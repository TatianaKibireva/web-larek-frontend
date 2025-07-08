import { IEvents } from "./base/events";
import { Modal } from "./common/Modal";
import { ensureElement, cloneTemplate } from "../utils/utils";

export class SuccessPresenter {
    private modal: Modal;
    private successTemplate: HTMLTemplateElement;

    constructor(events: IEvents, template: HTMLTemplateElement) {
        this.modal = new Modal(ensureElement('#modal-container'), events);
        this.successTemplate = template;

        events.on('order:success', (data: {total: number}) => {
            this.open(data.total);
        });
    }

    open(total: number) {
        const successElement = cloneTemplate(this.successTemplate);
        const description = ensureElement<HTMLElement>('.order-success__description', successElement);
        
        description.textContent = `Списано ${total} синапсов`;
        
        const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', successElement);
        closeButton.addEventListener('click', () => {
            this.modal.close();
        });

        this.modal.content = successElement;
        this.modal.open();
    }
}