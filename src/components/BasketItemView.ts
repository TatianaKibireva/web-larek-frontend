import { IBasketItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class BasketItemView extends Component<IBasketItem> {
  protected _index: HTMLElement;  
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  protected _id: string;

  constructor(container: HTMLElement, protected events: IEvents){
    super(container)

    this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this._title = ensureElement<HTMLElement>('.card__title', this.container);
    this._price = ensureElement<HTMLElement>('.card__price', this.container);
    this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this._deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('card:remove', { id: this._id });
  });
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
      this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
  }

  render(data?: Partial<IBasketItem> & { index?: number }): HTMLElement {
    if (!data) return this.container;
    super.render(data);

    if (data.id) {
        this._id = data.id;
    }
    if (data.index !== undefined) {
        this.index = data.index;
    }
    if (data.title) {
        this.title = data.title;
    }
    if (data.price !== undefined) {
        this.price = data.price;
    }

    return this.container;
  }
}