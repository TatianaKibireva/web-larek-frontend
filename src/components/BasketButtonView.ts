import { IHeaderBasket } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class BasketButtonView extends Component<IHeaderBasket> {

  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLButtonElement

  constructor(container: HTMLElement, events: IEvents){
    super(container)

    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container)
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container)

    this._basketButton.addEventListener('click', () => {
      events.emit('basket:open');
    })
  }

  set counter(value: number) {
    this.setText(this._basketCounter, value.toString());
  }
}

